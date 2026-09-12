import { getDatabase } from "@/lib/mongodb";
import { serializeDoc, serializeDocs } from "@/lib/db-helpers";
import Navbar from "@/components/Navbar";
import DynamicSectionRenderer, { DynamicHomeData } from "@/components/DynamicSectionRenderer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import Footer from "@/components/Footer";
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

async function getHomeData(): Promise<{
  settings: WebsiteSettings | null;
  navigation: NavigationItem[];
  homeData: DynamicHomeData;
}> {
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

    const homeData: DynamicHomeData = {
      settings: serializeDoc(settings),
      sections: serializeDocs(sections),
      heroSlides: serializeDocs(heroSlides),
      statistics: serializeDocs(statistics),
      aboutContent: serializeDoc(aboutContent),
      services: serializeDocs(services),
      industries: serializeDocs(industries),
      projects: serializeDocs(projects),
      clients: serializeDocs(clients),
      certifications: serializeDocs(certifications),
      testimonials: serializeDocs(testimonials),
      blogPosts: serializeDocs(blogPosts),
      faqs: serializeDocs(faqs),
      ctaContent: serializeDoc(ctaContent),
    };

    return {
      settings: serializeDoc(settings),
      navigation: serializeDocs(navigation),
      homeData,
    };
  } catch (error) {
    console.error("Failed to load home page data from MongoDB:", error instanceof Error ? error.message : "Unknown error");
    return {
      settings: null,
      navigation: [],
      homeData: {},
    };
  }
}

export default async function HomePage() {
  const { settings, navigation, homeData } = await getHomeData();

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar settings={settings} navItems={navigation} />
      <DynamicSectionRenderer data={homeData} />
      <FloatingWhatsApp />
      <Footer settings={settings} services={homeData.services} navItems={navigation} />
    </main>
  );
}
