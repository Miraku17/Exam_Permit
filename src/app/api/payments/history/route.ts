import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment"; // Import the model

export async function GET(req: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all payments sorted by createdAt in descending order
    const allPayments = await Payment.find({}).sort({ createdAt: -1 }).exec();

    return NextResponse.json(
      {
        success: true,
        count: allPayments.length,
        data: allPayments,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch payments",
      },
      { status: 500 }
    );
  }
}
