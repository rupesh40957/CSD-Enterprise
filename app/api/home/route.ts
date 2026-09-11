import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import {
  WebsiteSettings,
  NavigationItem,
  HomeSection,
  HeroSlide,
  Statistic,
  AboutContent,
  Service,
  Industry,
  Project,
  Client,
  Certification,
  Testimonial,
  BlogPost,
  Faq,
  CtaContent,
} from "@/models";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDatabase();

    const [
      settings,
      navigation,
      sections,
      heroSlides,
      statistics,
      aboutContent,
      services,
      industries,
      projects,
      clients,
      certifications,
      testimonials,
      blogPosts,
      faqs,
      ctaContent,
    ] = await Promise.all([
      db.collection<WebsiteSettings>("websiteSettings").findOne({}),
      db.collection<NavigationItem>("navigation").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<HomeSection>("homeSections").find({}).sort({ sortOrder: 1 }).toArray(),
      db.collection<HeroSlide>("heroSlides").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<Statistic>("statistics").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<AboutContent>("aboutContent").findOne({}),
      db.collection<Service>("services").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<Industry>("industries").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<Project>("projects").find({ active: true }).sort({ sortOrder: 1, createdAt: -1 }).toArray(),
      db.collection<Client>("clients").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<Certification>("certifications").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<Testimonial>("testimonials").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<BlogPost>("blogPosts").find({ isPublished: true }).sort({ publishedAt: -1 }).limit(6).toArray(),
      db.collection<Faq>("faqs").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
      db.collection<CtaContent>("ctaContent").findOne({}),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        settings: settings || null,
        navigation: navigation || [],
        sections: sections || [],
        heroSlides: heroSlides || [],
        statistics: statistics || [],
        aboutContent: aboutContent || null,
        services: services || [],
        industries: industries || [],
        projects: projects || [],
        clients: clients || [],
        certifications: certifications || [],
        testimonials: testimonials || [],
        blogPosts: blogPosts || [],
        faqs: faqs || [],
        ctaContent: ctaContent || null,
      },
    });
  } catch (error) {
    console.error("Error in /api/home:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load home content from database",
      },
      { status: 500 }
    );
  }
}
