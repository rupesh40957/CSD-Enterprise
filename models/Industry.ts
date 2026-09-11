import { ObjectId } from "mongodb";

export interface Industry {
  _id?: ObjectId | string;
  title: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
  solutions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
