import { ObjectId } from "mongodb";

export type HomeSectionType =
  | "hero"
  | "stats"
  | "about"
  | "services"
  | "industries"
  | "projects"
  | "clients"
  | "certifications"
  | "testimonials"
  | "blog"
  | "faq"
  | "presence"
  | "contact"
  | "cta";

export interface HomeSection {
  _id?: ObjectId | string;
  sectionType: HomeSectionType;
  title: string;
  subtitle?: string;
  badge?: string;
  sortOrder: number;
  isActive: boolean;
  settings?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}
