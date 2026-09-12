import { getDatabase } from "./mongodb";
import { WebsiteSettings, Service, Project, BlogPost } from "@/models";

/**
 * Universal JSON serializer to safely pass MongoDB objects (with ObjectId, Date, etc.)
 * from Server Components to Client Components.
 */
export function serializeDoc<T>(doc: T): T {
  if (!doc) return doc;
  return JSON.parse(JSON.stringify(doc));
}

export function serializeDocs<T>(docs: T[]): T[] {
  if (!docs || !Array.isArray(docs)) return [];
  return JSON.parse(JSON.stringify(docs));
}

/**
 * Fetch website global settings with fallback.
 */
export async function getWebsiteSettings(): Promise<WebsiteSettings | null> {
  try {
    const db = await getDatabase();
    const settings = await db.collection<WebsiteSettings>("websiteSettings").findOne({});
    return serializeDoc(settings);
  } catch (error) {
    console.error("Failed to fetch website settings:", error);
    return null;
  }
}

/**
 * Fetch a single service by its slug along with website settings and related services.
 */
export async function getServiceDetails(slug: string) {
  try {
    const db = await getDatabase();
    const [service, settings, allServices] = await Promise.all([
      db.collection<Service>("services").findOne({ slug, isActive: true }),
      db.collection<WebsiteSettings>("websiteSettings").findOne({}),
      db.collection<Service>("services").find({ isActive: true }).sort({ sortOrder: 1 }).toArray(),
    ]);

    return {
      service: serializeDoc(service),
      settings: serializeDoc(settings),
      relatedServices: serializeDocs(allServices.filter((s) => s.slug !== slug)),
    };
  } catch (error) {
    console.error(`Failed to fetch service details for '${slug}':`, error);
    return { service: null, settings: null, relatedServices: [] };
  }
}

/**
 * Fetch a single project by its slug along with website settings and related projects.
 */
export async function getProjectDetails(slug: string) {
  try {
    const db = await getDatabase();
    const [project, settings, allProjects] = await Promise.all([
      db.collection<Project>("projects").findOne({ slug, active: true }),
      db.collection<WebsiteSettings>("websiteSettings").findOne({}),
      db.collection<Project>("projects").find({ active: true }).sort({ sortOrder: 1, createdAt: -1 }).toArray(),
    ]);

    return {
      project: serializeDoc(project),
      settings: serializeDoc(settings),
      relatedProjects: serializeDocs(allProjects.filter((p) => p.slug !== slug)),
    };
  } catch (error) {
    console.error(`Failed to fetch project details for '${slug}':`, error);
    return { project: null, settings: null, relatedProjects: [] };
  }
}

/**
 * Fetch a single blog post by its slug along with website settings and recent posts.
 */
export async function getBlogPostDetails(slug: string) {
  try {
    const db = await getDatabase();
    const [post, settings, recentPosts] = await Promise.all([
      db.collection<BlogPost>("blogPosts").findOne({ slug, isPublished: true }),
      db.collection<WebsiteSettings>("websiteSettings").findOne({}),
      db.collection<BlogPost>("blogPosts")
        .find({ isPublished: true, slug: { $ne: slug } })
        .sort({ publishedAt: -1 })
        .limit(3)
        .toArray(),
    ]);

    return {
      post: serializeDoc(post),
      settings: serializeDoc(settings),
      recentPosts: serializeDocs(recentPosts),
    };
  } catch (error) {
    console.error(`Failed to fetch blog post details for '${slug}':`, error);
    return { post: null, settings: null, recentPosts: [] };
  }
}
