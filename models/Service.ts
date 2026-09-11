import { ObjectId } from "mongodb";

export interface Service {
  _id?: ObjectId | string;
  title: string;
  slug: string;
  number: string;
  tagline: string;
  shortDescription: string;
  description: string;
  icon: string;
  image: string;
  targetIndustries: string[];
  capabilities: string[];
  featured: boolean;
  sortOrder: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
