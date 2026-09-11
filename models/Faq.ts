import { ObjectId } from "mongodb";

export interface Faq {
  _id?: ObjectId | string;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
