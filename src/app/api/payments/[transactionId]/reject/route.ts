import { NextResponse, NextRequest } from "next/server";
import Payment from "@/models/Payment";
import { StudentTuition } from "@/models/studentTuition";
import connectDB from "@/lib/mongodb";

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

    await Payment.findOneAndUpdate({ transactionId }, { status: "rejected" });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
