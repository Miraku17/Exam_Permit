import { NextResponse } from "next/server";
import Payment from "@/models/Payment";
import { StudentTuition } from "@/models/studentTuition";
import connectDB from "@/lib/mongodb";

export async function POST(
  request: Request,
  { params }: { params: { transactionId: string } }
) {
  try {
    await connectDB();
    const { transactionId } = params;

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return NextResponse.json({ success: false, error: "Payment not found" });
    }

    await Payment.findOneAndUpdate({ transactionId }, { status: "accepted" });

    const studentTuition = await StudentTuition.findOne({
      userId: payment.studentId,
    });

    let remainingAmount = payment.amount;

    // Process payment through semesters
    for (const semester of studentTuition.semesters) {
      for (const term of semester.terms) {
        if (term.balance > 0 && remainingAmount > 0) {
          // Calculate payment for this term
          const paymentForTerm = Math.min(term.balance, remainingAmount);

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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
