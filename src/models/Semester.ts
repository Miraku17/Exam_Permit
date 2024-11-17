import mongoose, { Schema, model, models } from 'mongoose';
import { ISemester } from './types';
import CourseSchema from './Course';

const SemesterSchema = new Schema<ISemester>({
  programCode: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    enum: [1, 2],
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  courses: [CourseSchema],
  totals: {
    totalLecture: Number,
    totalLaboratory: Number,
    grandTotal: Number,
    termPayments: {
      preMidterm: Number,
      midterm: Number,
      preFinal: Number,
      final: Number,
    },
  },
});

export const Semester = models.Semester || model<ISemester>('Semester', SemesterSchema);