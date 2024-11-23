import { NextResponse, NextRequest } from "next/server";
import Payment from "@/models/Payment";
import { StudentTuition } from "@/models/studentTuition";
import connectDB from "@/lib/mongodb";
import User from "@/models/user";
interface PaymentReceiptData {
  transactionId: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  paymentDate: Date;
  college: string;
  payments: Array<{
    term: string;
    amountPaid: number;
  }>;
}

// for email sending
import nodemailer from "nodemailer";
import jsPDF from "jspdf";
import path from "path";
import fs from "fs";

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function generateReceiptPDF(data: PaymentReceiptData): Promise<Buffer> {
  try {
    // Create PDF with smaller dimensions
    const doc = new jsPDF({
      format: [148, 200],
      unit: 'mm'
    });

    // Add student name watermark with adjusted spacing
    doc.setFontSize(40);
    doc.setTextColor(220, 220, 220);
    const watermarkState = new (doc as any).GState({ opacity: 0.1 });

    // Calculate watermark positions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Add multiple watermarks diagonally with reduced spacing
    for (let y = -10; y < pageHeight + 25; y += 50) {
      for (let x = -25; x < pageWidth + 25; x += 60) {
        (doc as any).saveGraphicsState();
        (doc as any).setGState(watermarkState);
        doc.text(data.studentName.toUpperCase(), x, y, {
          angle: 45,
          align: "center",
        });
        (doc as any).restoreGraphicsState();
      }
    }

    try {
      // Add centered background logo
      const logoPath = path.join(process.cwd(), "public", "unorlogo.png");
      const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

      // Add background logo with transparency
      const logoState = new (doc as any).GState({ opacity: 0.1 });
      (doc as any).saveGraphicsState();
      (doc as any).setGState(logoState);

      // Calculate center position for logo - centered both vertically and horizontally
      const logoWidth = 100;  // Increased logo width
      const logoHeight = 100; // Maintain aspect ratio
      const logoX = (pageWidth - logoWidth) / 2; // Center horizontally
      const logoY = (pageHeight - logoHeight) / 2; // Center vertically

      doc.addImage(
        `data:image/png;base64,${logoBase64}`,
        "PNG",
        logoX,
        logoY,
        logoWidth,
        logoHeight
      );
      (doc as any).restoreGraphicsState();
    } catch (error) {
      console.error("Error adding logo:", error);
    }

    // Reset text color for regular content
    doc.setTextColor(0, 0, 0);

    // Header
    doc.setFontSize(12);
    doc.text("UNIVERSITY OF NEGROS OCCIDENTAL-RECOLETOS, INC.", 74, 15, {
      align: "center",
    });

    doc.setFontSize(10);
    doc.text("Accounting Office", 74, 22, { align: "center" });
    doc.text("Bacolod City", 74, 28, { align: "center" });

    // Receipt details
    doc.setFontSize(11);
    doc.text("OFFICIAL RECEIPT", 74, 38, { align: "center" });
    
    // Details
    doc.setFontSize(9);
    doc.text(`Receipt No: ${data.transactionId}`, 15, 45);
    doc.text(`Date: ${new Date(data.paymentDate).toLocaleDateString()}`, 15, 52);
    doc.text(`Student Name: ${data.studentName}`, 15, 59);
    doc.text(`College: ${data.college}`, 15, 66);

    // Payment details
    let yPos = 80;
    doc.text("Payment Details:", 15, yPos);
    yPos += 5;

    // Table headers with adjusted width
    doc.line(15, yPos, 133, yPos);
    yPos += 6;
    doc.text("Amount Paid:", 20, yPos);
    doc.text(
      `Php ${data.amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      75,
      yPos
    );
    yPos += 3;
    doc.line(15, yPos, 133, yPos);

    // Footer
    yPos += 25;
    doc.setFontSize(9);
    doc.text("REV. FR. AMADEO OAR", 95, yPos);
    doc.text("VP - Finance", 95, yPos + 5);

    // Convert to Buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
    return pdfBuffer;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
}
export async function POST(
  request: NextRequest,
  context: { params: { transactionId: string } }
) {
  try {
    await connectDB();
    const { transactionId } = context.params;

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return NextResponse.json({ success: false, error: "Payment not found" });
    }

    console.log("Payment Details", payment);

    //after the payment is fetched go to users collection go get the course

    const student = await User.findOne({ email: payment.emailAddress });

    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found" });
    }

    await Payment.findOneAndUpdate({ transactionId }, { status: "accepted" });

    const studentTuition = await StudentTuition.findOne({
      userId: payment.studentId,
    });

    let remainingAmount = payment.amount;
    const termPayments: Array<{ term: string; amountPaid: number }> = [];

    // Process payment through semesters
    for (const semester of studentTuition.semesters) {
      for (const term of semester.terms) {
        if (term.balance > 0 && remainingAmount > 0) {
          // Calculate payment for this term
          const paymentForTerm = Math.min(term.balance, remainingAmount);

          // Add to term payments array for receipt
          termPayments.push({
            term: `${semester.name} - ${term.name}`,
            amountPaid: paymentForTerm,
          });

          await StudentTuition.updateOne(
            {
              userId: payment.studentId,
              "semesters.terms._id": term._id,
            },
            {
              $inc: {
                "semesters.$.terms.$[term].paid": paymentForTerm,
                "semesters.$.terms.$[term].balance": -paymentForTerm,
                "semesters.$.totalPayments": paymentForTerm,
                "semesters.$.remainingBalance": -paymentForTerm,
              },
            },
            {
              arrayFilters: [{ "term._id": term._id }],
            }
          );

          remainingAmount -= paymentForTerm;
        }
      }
    }

    // Generate and send receipt
    const receiptData: PaymentReceiptData = {
      transactionId,
      studentName: payment.fullName,
      studentEmail: payment.emailAddress,
      amount: payment.amount,
      paymentDate: payment.createdAt,
      college: student.course,
      payments: termPayments,
    };

    const pdfBuffer = await generateReceiptPDF(receiptData);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: payment.emailAddress,
      subject: "Payment Receipt",
      text: "Thank you for your payment. Please find attached your official receipt.",
      attachments: [
        {
          filename: `payment_receipt_${transactionId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
