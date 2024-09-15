import { Schema, model } from 'mongoose';
import { TaskDocument } from '../types/task.interface';

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    description: {
      type: String,
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
    columnId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Column',
    },
  },
  { timestamps: true, id: true }
);

export default model<TaskDocument>('Task', taskSchema);
