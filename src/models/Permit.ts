// models/permit.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IPermit extends Document {
  studentId: mongoose.Types.ObjectId;
  studentTuitionId: mongoose.Types.ObjectId;
  permitNo: string;
  name: string;
  email: string;
  college: string;
  semester: number;
  term: string;
  schoolYear: string;
  courses: Array<{
    code: string;
    section: string;
  }>;
  dateIssued: Date;
  isValid: boolean;
}

const PermitSchema = new Schema<IPermit>({
  studentTuitionId: {
    type: Schema.Types.ObjectId,
    ref: 'StudentTuition',
    required: true
  },
  permitNo: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  college: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  term: {
    type: String,
    required: true
  },
  schoolYear: {
    type: String,
    required: true
  },
  courses: [{
    code: {
      type: String,
      required: true
    },
    section: {
      type: String,
      required: true
    }
  }],
  dateIssued: {
    type: Date,
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: true
  }
});

export const Permit = mongoose.models.Permit || mongoose.model<IPermit>('Permit', PermitSchema);