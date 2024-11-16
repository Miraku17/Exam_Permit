import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";

// in your API route (pages/api/payments.ts)
export async function POST(req: NextRequest) {
    try {
      await connectDB();
      const formData = await req.formData();
  
      // Log raw amount from formData
      console.log("Raw amount from formData:", formData.get("amount"));
      
      // Convert and validate amount
      const rawAmount = formData.get("amount");
      const amount = parseFloat(rawAmount as string);
      
      // Log converted amount
      console.log("Converted amount:", amount);
      console.log("Amount type:", typeof amount);
  
      const paymentData = {
        givenName: (formData.get("givenName") as string)?.trim(),
        familyName: (formData.get("familyName") as string)?.trim(),
        mobileNumber: (formData.get("mobileNumber") as string)?.trim(),
        emailAddress: (formData.get("email") as string)?.trim().toLowerCase(),
        referenceNumber: (formData.get("referenceNumber") as string)?.trim(),
        paymentGateway: formData.get("paymentMethod") as "GCash",
        amount: amount, 
        proofOfPaymentUrl: "temporary_url",
        status: "pending" as const,
      };
  
      // Log the schema definition
      console.log("Payment Schema:", Payment.schema.paths.amount);
      
      // Log payment data before save
      console.log("Payment data before save:", {
        ...paymentData,
        amount: {
          value: paymentData.amount,
          type: typeof paymentData.amount
        }
      });
  
      // Create the payment
      const payment = await Payment.create(paymentData);
  
      // Log the raw document before conversion
      console.log("Raw payment document:", payment._doc);
  
      // Query the saved document
      const savedPayment = await Payment.findById(payment._id).lean();
      console.log("Retrieved payment:", savedPayment);
  
      return NextResponse.json(
        {
          message: "Payment submitted successfully",
          payment: payment.toJSON(),
        },
        { status: 201 }
      );
    } catch (error: any) {
      // ... error handling ...
    }
  }