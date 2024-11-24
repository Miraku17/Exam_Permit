import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jsPDF from "jspdf";
import path from "path";
import fs from "fs";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { StudentTuition } from "@/models/studentTuition";
import { Permit } from "@/models/Permit";

interface StudentData {
  name: string;
  college: string;
  semester: string;
  schoolYear: string;
  term: string;
  courses: Array<{
    code: string;
    section: string;
  }>;
  semesterNumber: number;
  studentTuitionId: string;
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

async function generatePermitPDF({ studentData, permitNo }: { studentData: StudentData, permitNo: string }) {
  const doc = new jsPDF();
  
  // Add name watermark
  doc.setFontSize(100);
  doc.setTextColor(220, 220, 220);
  const watermarkState = new (doc as any).GState({ opacity: 0.2 });
  
  // Calculate watermark positions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  // Add multiple watermarks diagonally
  for (let y = -20; y < pageHeight + 50; y += 60) {
    for (let x = -50; x < pageWidth + 50; x += 100) { 
      (doc as any).saveGraphicsState();
      (doc as any).setGState(watermarkState);
      doc.text(studentData.name, x, y, { 
        angle: 45,
        align: 'center'
      });
      (doc as any).restoreGraphicsState();
    }
  }

  // Read logo from public folder
  const logoPath = path.join(process.cwd(), "public", "unorlogo.png");
  const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });

  // Add background logo with transparency
  const logoState = new (doc as any).GState({ opacity: 0.1 });
  (doc as any).saveGraphicsState();
  (doc as any).setGState(logoState);
  doc.addImage(
    `data:image/png;base64,${logoBase64}`,
    "PNG",
    50,
    70,
    100,
    100
  );
  (doc as any).restoreGraphicsState();

  // Reset text color for regular content
  doc.setTextColor(0, 0, 0);

  // Set font size and style
  doc.setFontSize(16);

  // Add header text
  doc.text("UNIVERSITY OF NEGROS OCCIDENTAL-RECOLETOS, INC.", 105, 20, {
    align: "center",
  });

  doc.setFontSize(14);
  doc.text("Accounting Office", 105, 30, { align: "center" });
  doc.text("Bacolod City", 105, 40, { align: "center" });

  // Add permit title
  doc.setFontSize(14);
  doc.text(`${studentData.term.toUpperCase()} EXAMINATION PERMIT`, 105, 55, {
    align: "center",
  });

  // Add permit number
  doc.setFontSize(10);
  // const permitNo = Math.random().toString().slice(2, 10);
  doc.text(`Permit No. ${permitNo}`, 170, 65, { align: "right" });

  // Add main content
  doc.setFontSize(12);
  doc.text("To all Whom it may Concern:", 20, 75);

  const mainText = `This is to certify that ${studentData.name} of the ${studentData.college} is officially enrolled as of this ${studentData.semester} Semester ${studentData.schoolYear}, and is hereby permitted to take examination(s) in the following courses only.`;

  doc.setFontSize(10);
  const splitText = doc.splitTextToSize(mainText, 170);
  doc.text(splitText, 20, 85);

  // Add table
  let yPos = 110;

  // Table headers
  doc.setFontSize(10);
  doc.text("Courses", 20, yPos);
  doc.text("Section", 70, yPos);
  doc.text("Proctor", 120, yPos);
  doc.text("Remarks", 170, yPos);

  // Underline for headers
  doc.line(20, yPos + 2, 190, yPos + 2);

  // Table content
  yPos += 10;
  studentData.courses.forEach((course) => {
    doc.text(course.code, 20, yPos);
    doc.text(course.section, 70, yPos);
    yPos += 8;
  });

  // Add notes
  yPos += 10;
  doc.setFontSize(10);
  doc.text("NOTE:", 20, yPos);
  yPos += 10;

  const note1 =
    "This permit should be presented to the PROCTOR for inspection during the administration of the examination.";
  const note2 =
    "This permit is valid only for the period indicated on this form.";

  const splitNote1 = doc.splitTextToSize(note1, 170);
  const splitNote2 = doc.splitTextToSize(note2, 170);

  doc.text(splitNote1, 20, yPos);
  doc.text(splitNote2, 20, yPos + 10);

  // Add signature
  yPos += 30;
  doc.text("REV. FR. AMADEO OAR", 140, yPos);
  doc.text("VP - Finance", 140, yPos + 5);

  return doc.output("arraybuffer");
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, college, semester, schoolYear, courses, email, term, studentTuitionId, semesterNumber } =
      await request.json();

    const studentData: StudentData = {
      name: name || "N/A",
      college: college || "N/A",
      semester: semester || "1st",
      term: term || "Preliminary",
      schoolYear: schoolYear || "2024-2025",
      courses: courses || [
        { code: "ADVACC669", section: "C20" },
        { code: "MACRSH730", section: "C20" },
        { code: "MANREP030", section: "C20" },
        { code: "VALMET539", section: "C20" },
      ],
    };

    const permitNo = Math.random().toString().slice(2, 10);
    const pdfBuffer = await generatePermitPDF({studentData, permitNo});

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Examination Permit",
      text: "Good day! Please find attached your examination permit.",
      attachments: [
        {
          filename: `${term}_exam_permit_${name.replace(/\s+/g, "_")}.pdf`,
          content: Buffer.from(pdfBuffer),
          contentType: "application/pdf",
        },
      ],
    });

    const permit = await Permit.create({
      studentTuitionId: new mongoose.Types.ObjectId(studentTuitionId),
      permitNo,
      name,
      email,
      college,
      semester: semesterNumber,
      term,
      schoolYear,
      courses,
      dateIssued: new Date(),
      isValid: true
    });

    const studentTuition = await StudentTuition.findByIdAndUpdate(
      studentTuitionId,
      {
        $inc: {
          "semesters.$[sem].terms.$[t].examPermitRequested": 1
        }
      },
      {
        arrayFilters: [
          { "sem.semester": semesterNumber },
          { "t.term": term }
        ],
        new: true,
        runValidators: true
      }
    );

    return NextResponse.json(
      {
        success: true,
        messageId: info.messageId,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending permit:", error);
    return NextResponse.json(
      {
        error: "Failed to send permit",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}