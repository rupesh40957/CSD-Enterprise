import { ObjectId } from "mongodb";

export interface Client {
  _id?: ObjectId | string;
  name: string;
  logo: string;
  website?: string;
  sortOrder: number;
  isActive: boolean;
  featured?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
