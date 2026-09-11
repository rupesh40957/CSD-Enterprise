import { ObjectId } from "mongodb";

export interface BlogPost {
  _id?: ObjectId | string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole?: string;
  category: string;
  tags: string[];
  readTime?: string;
  publishedAt: Date;
  featured: boolean;
  isPublished: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
