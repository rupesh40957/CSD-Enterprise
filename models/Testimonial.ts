import { ObjectId } from "mongodb";

export interface Testimonial {
  _id?: ObjectId | string;
  name: string;
  designation: string;
  company: string;
  content: string;
  photo?: string;
  rating: number;
  projectReference?: string;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
