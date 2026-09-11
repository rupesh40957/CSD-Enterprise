import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { BlogPost, WebsiteSettings } from "@/models";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ArrowLeft, Calendar, Clock, User, Tag, PhoneCall } from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

async function getPostData(slug: string) {
  try {
    const db = await getDatabase();
    const [post, settings] = await Promise.all([
      db.collection<BlogPost>("blogPosts").findOne({ slug, isPublished: true }),
      db.collection<WebsiteSettings>("websiteSettings").findOne({}),
    ]);
    function serialize<T>(item: T): T {
      return JSON.parse(JSON.stringify(item));
    }
    return {
      post: post ? serialize(post) : null,
      settings: settings ? serialize(settings) : null,
    };
  } catch {
    return { post: null, settings: null };
  }
}

export default async function BlogPostDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const { post, settings } = await getPostData(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar settings={settings} />

      <article className="flex-1 pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/#blog"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Technical Bulletins</span>
            </Link>
          </div>

          <div className="space-y-4 mb-8">
            <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase bg-navy-900 text-cyan-400 border border-cyan-500/30">
              {post.category}
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-navy-950 dark:text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-y border-slate-200 dark:border-navy-800 py-3">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-cyan-500" />
                <span>{post.author}</span>
                {post.authorRole && <span>• {post.authorRole}</span>}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              {post.readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-500" />
                  <span>{post.readTime}</span>
                </div>
              )}
            </div>
          </div>

          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden mb-10 shadow-xl border border-slate-200 dark:border-cyan-500/20">
            <Image
              src={post.coverImage || "/images/industrial-facility.jpg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 text-base leading-relaxed space-y-6">
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {post.excerpt}
            </p>
            <div className="whitespace-pre-line">{post.content}</div>
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-6 border-t border-slate-200 dark:border-navy-800 flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-cyan-500" />
              {post.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold">Have an engineering challenge?</h3>
              <p className="text-xs text-white/90 mt-1">
                Consult with our systems integration team for custom industrial architectures.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-white hover:bg-slate-100 shadow-md transition-all shrink-0"
            >
              <PhoneCall className="w-4 h-4 text-cyan-600" />
              <span>Contact Engineering Desk</span>
            </Link>
          </div>
        </div>
      </article>

      <FloatingWhatsApp />
      <Footer settings={settings} />
    </main>
  );
}
