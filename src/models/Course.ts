import mongoose, {Schema} from "mongoose";
import { ICourse } from "./types";
import TermSchema from "./Term";


const CourseSchema = new Schema<ICourse>({
    courseCode: {
      type: String,
      required: true
    },
    academicUnits: {
      type: Number,
      required: true
    },
    lecValue: {
      type: Number,
      required: true
    },
    labValue: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Regular', 'Irregular'],
      default: 'Regular'
    },
    // terms: [TermSchema],
    totalCourseFee: {
      lecture: Number,
      laboratory: Number,
      total: Number
    },
    // totalPayments: {
    //   type: Number,
    //   default: 0
    // },
    // remainingBalance: Number
  });
  
  export default CourseSchema;