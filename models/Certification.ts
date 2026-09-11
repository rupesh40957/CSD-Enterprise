import { ObjectId } from "mongodb";

export interface Certification {
  _id?: ObjectId | string;
  name: string;
  issuer: string;
  description: string;
  logo?: string;
  certificateImage?: string;
  link?: string;
  badgeCode?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
