import { ObjectId } from "mongodb";

export interface WebsiteSettings {
  _id?: ObjectId | string;
  companyName: string;
  tagline: string;
  logo: string;
  favicon: string;
  phone: string;
  altPhone?: string;
  email: string;
  address: string;
  workingHours: string;
  googleMapsUrl?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
  whatsapp?: string;
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultSeoImage?: string;
  copyrightText: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  updatedAt?: Date;
}
