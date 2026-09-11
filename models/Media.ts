import { ObjectId } from "mongodb";

export interface Media {
  _id?: ObjectId | string;
  url: string;
  publicId?: string;
  filename: string;
  alt: string;
  type: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
  createdAt: Date;
}
