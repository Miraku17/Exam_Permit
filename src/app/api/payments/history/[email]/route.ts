// app/api/payments/history/[email]/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email;
    
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const payments = await Payment.find({
      emailAddress: decodeURIComponent(email)
    }).sort({ createdAt: -1 }); // Sort by newest first

    // If no payments found
    if (!payments || payments.length === 0) {
      return NextResponse.json(
        { 
          message: "No payment history found",
          payments: []
        },
        { status: 200 }
      );
    }

    // Return the payments
    return NextResponse.json({
      message: "Payment history retrieved successfully",
      payments: payments,
      count: payments.length
    });

  } catch (error: any) {
    console.error("Error fetching payment history:", error);
    
    return NextResponse.json(
      {
        message: "Error fetching payment history",
        error: error.message
      },
      { status: 500 }
    );
  }
}