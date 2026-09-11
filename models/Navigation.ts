import { ObjectId } from "mongodb";

export interface NavigationItem {
  _id?: ObjectId | string;
  label: string;
  href: string;
  sortOrder: number;
  isActive: boolean;
  isExternal?: boolean;
  badge?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
