import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { UserDocument } from '../types';

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      validate: [validator.isEmail, 'invalid email'],
      createIndexes: { unique: true },
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      // don't return password in database queries
      select: false,
    },
  },
  { timestamps: true, id: true }
);

// Hook to encrypt password before saving.
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

userSchema.methods.validatePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export default model<UserDocument>('User', userSchema);
