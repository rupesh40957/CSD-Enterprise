import { ObjectId } from "mongodb";

export interface AboutCoreValue {
  icon: string;
  title: string;
  description: string;
  highlight: string;
  color?: string;
}

export interface AboutContent {
  _id?: ObjectId | string;
  badge: string;
  heading: string;
  description: string;
  visionTitle: string;
  visionDescription: string;
  experienceBadge: string;
  statsOffshore: string;
  statsOffshoreSub: string;
  statsOnshore: string;
  statsOnshoreSub: string;
  coreValues: AboutCoreValue[];
  updatedAt?: Date;
}
