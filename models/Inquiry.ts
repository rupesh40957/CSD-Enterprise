import { ObjectId } from "mongodb";

export type InquiryStatus = "New" | "Contacted" | "In Review" | "Completed";

export interface Inquiry {
  _id?: ObjectId | string;
  fullName: string;
  workEmail: string;
  phone: string;
  organization: string;
  solution: string;
  message: string;
  status: InquiryStatus;
  createdAt: Date;
  updatedAt: Date;
}
