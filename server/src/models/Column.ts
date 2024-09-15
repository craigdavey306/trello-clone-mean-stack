import { Schema, model } from 'mongoose';
import { ColumnDocument } from '../types/column.interface';

const columnSchema = new Schema<ColumnDocument>(
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
    boardId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Board',
    },
  },
  { timestamps: true, id: true }
);

export default model<ColumnDocument>('Column', columnSchema);
