import { ObjectId } from "mongodb";

export interface Project {
  _id?: ObjectId | string;
  title: string;
  slug: string;
  client: string;
  location?: string;
  category: string;
  shortDescription?: string;
  description: string;
  scope: string;
  image: string;
  gallery?: string[];
  completionDate?: string;
  featured: boolean;
  active: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}
