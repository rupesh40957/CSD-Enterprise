import { ObjectId } from "mongodb";

export interface Statistic {
  _id?: ObjectId | string;
  label: string;
  value: string;
  suffix?: string;
  sublabel?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
