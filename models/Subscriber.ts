import { ObjectId } from "mongodb";

export interface Subscriber {
  _id?: ObjectId | string;
  email: string;
  createdAt: Date;
}
