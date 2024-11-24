import mongoose from "mongoose";

const studentTuitionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  semesters: [
    {
      semester: Number,
      terms: [
        {
          term: String,
          dueAmount: Number,
          paid: { type: Number, default: 0 },
          balance: Number,
          examPermitRequested: {
            type: Number,
            default: 0
          }
        },
      ],
      totalPayments: { type: Number, default: 0 },
      remainingBalance: Number,
    },
  ],
});


delete mongoose.models.StudentTuition;

export const StudentTuition = mongoose.model("StudentTuition", studentTuitionSchema);
