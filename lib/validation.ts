import { z } from "zod";

export const inquirySchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters"),
  workEmail: z
    .string()
    .trim()
    .email("Please provide a valid work email address")
    .toLowerCase(),
  phone: z
    .string()
    .trim()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number cannot exceed 20 characters")
    .regex(/^[+0-9\s\-()]+$/, "Phone number contains invalid characters"),
  organization: z
    .string()
    .trim()
    .min(2, "Organization name must be at least 2 characters")
    .max(150, "Organization name cannot exceed 150 characters"),
  solution: z
    .string()
    .trim()
    .min(2, "Please select an area of interest"),
  message: z
    .string()
    .trim()
    .min(10, "Project scope or message must be at least 10 characters")
    .max(3000, "Message cannot exceed 3000 characters"),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(["New", "Contacted", "In Review", "Completed"]),
});

export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .toLowerCase(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid administrator email"),
  password: z.string().min(1, "Password is required"),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation do not match",
    path: ["confirmPassword"],
  });

export const projectSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  slug: z.string().trim().optional(),
  client: z.string().trim().min(2, "Client name is required"),
  location: z.string().trim().optional(),
  category: z.string().trim().min(2, "Category is required"),
  shortDescription: z.string().trim().optional(),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  scope: z.string().trim().min(5, "Scope details are required"),
  image: z.string().trim().min(1, "Image reference is required"),
  gallery: z.array(z.string()).optional(),
  completionDate: z.string().optional(),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  sortOrder: z.number().default(0),
});

export const websiteSettingsSchema = z.object({
  companyName: z.string().trim().min(2, "Company name is required"),
  tagline: z.string().trim().min(2, "Tagline is required"),
  logo: z.string().trim().min(1, "Logo path is required"),
  favicon: z.string().trim().default("/logo/csd-favicon.png"),
  phone: z.string().trim().min(5, "Primary phone number is required"),
  altPhone: z.string().trim().optional(),
  email: z.string().trim().email("Valid company email is required"),
  address: z.string().trim().min(5, "Address is required"),
  workingHours: z.string().trim().min(3, "Working hours are required"),
  googleMapsUrl: z.string().trim().optional(),
  facebook: z.string().trim().optional(),
  twitter: z.string().trim().optional(),
  linkedin: z.string().trim().optional(),
  youtube: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  defaultSeoTitle: z.string().trim().min(5, "SEO title is required"),
  defaultSeoDescription: z.string().trim().min(10, "SEO description is required"),
  defaultSeoImage: z.string().trim().optional(),
  copyrightText: z.string().trim().min(5, "Copyright text is required"),
  privacyPolicyUrl: z.string().trim().optional(),
  termsUrl: z.string().trim().optional(),
});

export const navigationSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  href: z.string().trim().min(1, "URL or anchor is required"),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  isExternal: z.boolean().optional(),
  badge: z.string().optional(),
});

export const homeSectionSchema = z.object({
  sectionType: z.enum([
    "hero",
    "stats",
    "about",
    "services",
    "industries",
    "projects",
    "clients",
    "certifications",
    "testimonials",
    "blog",
    "faq",
    "presence",
    "contact",
    "cta",
  ]),
  title: z.string().trim().min(1, "Title is required"),
  subtitle: z.string().trim().optional(),
  badge: z.string().trim().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  settings: z.record(z.string(), z.unknown()).optional(),
});

export const heroSlideSchema = z.object({
  badge: z.string().trim().min(1, "Badge text is required"),
  heading: z.string().trim().min(3, "Heading is required"),
  highlightedText: z.string().trim().min(1, "Highlighted text is required"),
  description: z.string().trim().min(10, "Description is required"),
  primaryCtaText: z.string().trim().min(1, "Primary CTA label is required"),
  primaryCtaUrl: z.string().trim().min(1, "Primary CTA URL is required"),
  secondaryCtaText: z.string().trim().min(1, "Secondary CTA label is required"),
  secondaryCtaUrl: z.string().trim().min(1, "Secondary CTA URL is required"),
  image: z.string().trim().min(1, "Image path is required"),
  systemUptime: z.string().trim().optional(),
  telemetryItems: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        status: z.string().optional(),
      })
    )
    .optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const statisticSchema = z.object({
  label: z.string().trim().min(1, "Label is required"),
  value: z.string().trim().min(1, "Metric value is required"),
  suffix: z.string().trim().optional(),
  sublabel: z.string().trim().optional(),
  icon: z.string().trim().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const aboutCardSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Card title is required"),
  description: z.string().trim().default(""),
  image: z.string().trim().min(1, "Image is required"),
  list: z.array(z.string()).optional(),
});

export const aboutContentSchema = z.object({
  badge: z.string().trim().min(1, "Badge is required"),
  heading: z.string().trim().min(3, "Heading is required"),
  description: z.string().trim().min(10, "Description is required"),
  visionTitle: z.string().trim().min(2, "Vision title is required"),
  visionDescription: z.string().trim().min(10, "Vision description is required"),
  experienceBadge: z.string().trim().default("Established 2019"),
  statsOffshore: z.string().trim().default("Offshore Deepwater"),
  statsOffshoreSub: z.string().trim().default("Mumbai High TSAT SCADA"),
  statsOnshore: z.string().trim().default("Onshore Industrial"),
  statsOnshoreSub: z.string().trim().default("Power, Oil & Gas, Police"),
  bannerImage: z.string().trim().optional(),
  establishmentImage: z.string().trim().optional(),
  visionImage: z.string().trim().optional(),
  approachImage: z.string().trim().optional(),
  expertiseImage: z.string().trim().optional(),
  managementImage: z.string().trim().optional(),
  coreValuesImage: z.string().trim().optional(),
  cards: z.array(aboutCardSchema).optional(),
  coreValues: z.array(
    z.object({
      icon: z.string().default("ShieldCheck"),
      title: z.string().min(1),
      description: z.string().min(1),
      highlight: z.string().min(1),
      color: z.string().optional(),
    })
  ),
});


export const serviceSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  slug: z.string().trim().optional(),
  number: z.string().trim().default("01"),
  tagline: z.string().trim().min(3, "Tagline is required"),
  shortDescription: z.string().trim().min(10, "Short description is required"),
  description: z.string().trim().min(10, "Full description is required"),
  icon: z.string().trim().default("Cpu"),
  image: z.string().trim().min(1, "Image path is required"),
  targetIndustries: z.array(z.string()).default([]),
  capabilities: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const industrySchema = z.object({
  title: z.string().trim().min(3, "Industry title is required"),
  slug: z.string().trim().optional(),
  description: z.string().trim().min(10, "Description is required"),
  image: z.string().trim().min(1, "Image is required"),
  icon: z.string().trim().default("Cpu"),
  featured: z.boolean().default(false),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  solutions: z.array(z.string()).optional(),
});

export const clientSchema = z.object({
  name: z.string().trim().min(2, "Client name is required"),
  logo: z.string().trim().min(1, "Logo path is required"),
  website: z.string().trim().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
  featured: z.boolean().optional(),
});

export const certificationSchema = z.object({
  name: z.string().trim().min(2, "Certification name is required"),
  issuer: z.string().trim().min(2, "Issuing authority is required"),
  description: z.string().trim().min(5, "Description is required"),
  logo: z.string().trim().optional(),
  certificateImage: z.string().trim().optional(),
  link: z.string().trim().optional(),
  badgeCode: z.string().trim().optional(),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(2, "Client name is required"),
  designation: z.string().trim().min(2, "Designation is required"),
  company: z.string().trim().min(2, "Company is required"),
  content: z.string().trim().min(10, "Testimonial content is required"),
  photo: z.string().trim().optional(),
  rating: z.number().min(1).max(5).default(5),
  projectReference: z.string().trim().optional(),
  featured: z.boolean().default(true),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const blogPostSchema = z.object({
  title: z.string().trim().min(3, "Title is required"),
  slug: z.string().trim().optional(),
  excerpt: z.string().trim().min(10, "Excerpt is required"),
  content: z.string().trim().min(20, "Content is required"),
  coverImage: z.string().trim().min(1, "Cover image is required"),
  author: z.string().trim().min(2, "Author is required"),
  authorRole: z.string().trim().optional(),
  category: z.string().trim().min(2, "Category is required"),
  tags: z.array(z.string()).default([]),
  readTime: z.string().optional(),
  publishedAt: z.string().or(z.date()).optional(),
  featured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const faqSchema = z.object({
  question: z.string().trim().min(3, "Question is required"),
  answer: z.string().trim().min(5, "Answer is required"),
  category: z.string().trim().default("General"),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
});

export const ctaContentSchema = z.object({
  badge: z.string().trim().optional(),
  heading: z.string().trim().min(3, "Heading is required"),
  highlightedText: z.string().trim().optional(),
  description: z.string().trim().min(10, "Description is required"),
  primaryButtonText: z.string().trim().min(1, "Primary button text is required"),
  primaryButtonUrl: z.string().trim().min(1, "Primary button URL is required"),
  secondaryButtonText: z.string().trim().optional(),
  secondaryButtonUrl: z.string().trim().optional(),
  backgroundImage: z.string().trim().optional(),
  emergencyContactText: z.string().trim().optional(),
  emergencyContactPhone: z.string().trim().optional(),
  isActive: z.boolean().default(true),
});
