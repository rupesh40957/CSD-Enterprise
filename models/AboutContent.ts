import { ObjectId } from "mongodb";

export interface AboutCard {
  id?: string;
  title: string;
  description?: string;
  image: string;
  list?: string[];
}


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
  bannerImage?: string;
  establishmentImage?: string;
  visionImage?: string;
  approachImage?: string;
  expertiseImage?: string;
  managementImage?: string;
  coreValuesImage?: string;
  cards?: AboutCard[];
  coreValues: AboutCoreValue[];
  updatedAt?: Date;
}
