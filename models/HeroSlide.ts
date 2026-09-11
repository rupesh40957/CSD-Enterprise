import { ObjectId } from "mongodb";

export interface HeroTelemetryItem {
  label: string;
  value: string;
  status?: string;
}

export interface HeroSlide {
  _id?: ObjectId | string;
  badge: string;
  heading: string;
  highlightedText: string;
  description: string;
  primaryCtaText: string;
  primaryCtaUrl: string;
  secondaryCtaText: string;
  secondaryCtaUrl: string;
  image: string;
  systemUptime?: string;
  telemetryItems?: HeroTelemetryItem[];
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
