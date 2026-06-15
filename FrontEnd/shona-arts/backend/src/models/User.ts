import bcrypt from 'bcryptjs';
import mongoose, { Schema, type HydratedDocument } from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: 'customer' | 'admin';
  blocked: boolean;
  wishlist: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    avatar: { type: String, default: '' },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    blocked: { type: Boolean, default: false },
    wishlist: [{ type: Schema.Types.ObjectId, ref: 'Painting' }],
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  },
  { timestamps: true },
);

userSchema.pre('save', async function hashPassword(this: HydratedDocument<IUser>) {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(this: HydratedDocument<IUser>, password: string) {
  return bcrypt.compare(password, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
