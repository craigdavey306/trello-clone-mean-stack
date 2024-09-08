import { Schema, model } from 'mongoose';
import { BoardDocument } from '../types/board.interface';

const boardSchema = new Schema<BoardDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      ref: 'User',
    },
  },
  { timestamps: true, id: true }
);

export default model<BoardDocument>('Board', boardSchema);
