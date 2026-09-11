import { ObjectId } from "mongodb";

export interface CtaContent {
  _id?: ObjectId | string;
  badge?: string;
  heading: string;
  highlightedText?: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  backgroundImage?: string;
  emergencyContactText?: string;
  emergencyContactPhone?: string;
  isActive: boolean;
  updatedAt?: Date;
}
