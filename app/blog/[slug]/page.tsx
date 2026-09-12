import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { getBlogPostDetails } from "@/lib/db-helpers";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Tag,
  PhoneCall,
  ChevronRight,
  Share2,
  BookOpen,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const { post, settings } = await getBlogPostDetails(slug);

  if (!post) {
    return {
      title: "Article Not Found | CSD Enterprises",
    };
  }

  const companyName = settings?.companyName || "CSD Enterprises";
  const title = `${post.title} | Technical Bulletin | ${companyName}`;
  const description = post.excerpt || `${post.title} - Technical Engineering Insights by ${companyName}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const { post, settings, recentPosts } = await getBlogPostDetails(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar settings={settings} />

      <article className="flex-1 pt-28 sm:pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-red-600 dark:hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/#blog" className="hover:text-red-600 dark:hover:text-cyan-400 transition-colors">
              Technical Bulletins
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px] sm:max-w-none">
              {post.title}
            </span>
          </nav>

          {/* Header Metadata */}
          <div className="space-y-4 mb-8">
            <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-red-600/10 text-red-600 dark:bg-red-500/10 dark:text-red-400 border border-red-500/20">
              {post.category}
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-navy-950 dark:text-white tracking-tight leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-3 border-y border-slate-200 dark:border-navy-800 py-3.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <User className="w-3.5 h-3.5 text-red-600 dark:text-cyan-400" />
                <span>{post.author}</span>
                {post.authorRole && <span>• {post.authorRole}</span>}
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              {post.readTime && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{post.readTime}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden mb-12 shadow-2xl border border-slate-200 dark:border-navy-800">
            <Image
              src={post.coverImage || "/images/industrial-facility.jpg"}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content Body */}
          <div className="glass-panel-elevated rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-navy-800 mb-12">
            <p className="text-lg sm:text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed mb-6 border-b border-slate-200 dark:border-navy-800 pb-6">
              {post.excerpt}
            </p>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
              {post.content}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-navy-800 flex items-center gap-2 flex-wrap">
                <Tag className="w-4 h-4 text-red-500" />
                {post.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* CTA Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mb-14">
            <div>
              <h3 className="text-xl font-extrabold">Have an engineering challenge?</h3>
              <p className="text-xs text-white/90 mt-1">
                Consult with our systems integration team for custom industrial architectures and RFQs.
              </p>
            </div>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-navy-950 bg-white hover:bg-slate-100 shadow-md transition-all shrink-0 btn-press"
            >
              <PhoneCall className="w-4 h-4 text-red-600" />
              <span>Contact Engineering Desk</span>
            </Link>
          </div>

          {/* Recent Technical Bulletins */}
          {recentPosts && recentPosts.length > 0 && (
            <div className="pt-8 border-t border-slate-200 dark:border-navy-800">
              <h3 className="text-xl font-black text-navy-950 dark:text-white mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-red-600 dark:text-cyan-400" />
                <span>More Technical Bulletins</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recentPosts.map((r) => (
                  <Link
                    key={r.slug || String(r._id)}
                    href={`/blog/${r.slug}`}
                    className="glass-panel-elevated rounded-2xl p-5 hover:border-red-500/40 dark:hover:border-cyan-500/40 transition-all card-hover flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold text-red-600 dark:text-cyan-400 uppercase tracking-wider">
                        {r.category}
                      </span>
                      <h4 className="text-sm font-bold text-navy-950 dark:text-white line-clamp-2 leading-snug">
                        {r.title}
                      </h4>
                    </div>
                    <div className="pt-4 flex items-center justify-between text-xs text-slate-400">
                      <span>{formatDate(r.publishedAt)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <FloatingWhatsApp />
      <Footer settings={settings} />
    </main>
  );
}
