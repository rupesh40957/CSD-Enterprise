import { ObjectId } from "mongodb";

export interface AdminUser {
  _id?: ObjectId | string;
  email: string;
  passwordHash: string;
  name: string;
  role: "admin" | "superadmin";
  mustChangePassword: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}
