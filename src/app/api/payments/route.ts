import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { v2 as cloudinary } from "cloudinary";
import crypto from "crypto";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function generateTransactionId() {
  return `TRX${Date.now().toString(36)}${crypto.randomBytes(2).toString('hex')}`.toUpperCase();
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();

    // Generate transaction ID
    const transactionId = generateTransactionId();

    // Handle image upload
    const proofFile = formData.get("proofOfPayment") as File;
    let proofOfPaymentUrl = "";

    if (proofFile) {
      // Convert File to Buffer
      const bytes = await proofFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "payment-proofs",
              resource_type: "auto",
              allowed_formats: ["jpg", "jpeg", "png", "pdf"],
              max_file_size: 5000000, // 5MB
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      // @ts-ignore (result will have secure_url)
      proofOfPaymentUrl = result.secure_url;
    }

    // Convert and validate amount
    const rawAmount = formData.get("amount");
    const amount = parseFloat(rawAmount as string);

    const paymentData = {
      transactionId,
      studentId: (formData.get("studentId") as string)?.trim(),
      fullName: (formData.get("fullName") as string)?.trim(),
      mobileNumber: (formData.get("mobileNumber") as string)?.trim(),
      emailAddress: (formData.get("email") as string)?.trim().toLowerCase(),
      referenceNumber: (formData.get("referenceNumber") as string)?.trim(),
      paymentGateway: formData.get("paymentMethod") as string,
      amount: amount,
      proofOfPaymentUrl: proofOfPaymentUrl,
      status: "pending" as const,
    };

    // Create the payment
    const payment = await Payment.create(paymentData);

    return NextResponse.json(
      {
        message: "Payment submitted successfully",
        payment: payment.toJSON(),
        transactionId,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      {
        message: error.message || "Error submitting payment",
      },
      { status: 500 }
    );
  }
}
