import mongoose, { Schema } from 'mongoose';
import { ITerm } from './types';

const TermSchema = new Schema<ITerm>({
  name: {
    type: String,
    enum: ['1st', '2nd', '3rd'],
    required: true
  },
  due: {
    type: Number,
    required: true
  },
  paid: {
    type: Number,
    default: 0
  },
  balance: {
    type: Number,
    required: true
  }
});

export default TermSchema;