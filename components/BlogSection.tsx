"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { BlogPost } from "@/models";
import { formatDate } from "@/lib/utils";

interface BlogSectionProps {
  blogPosts?: BlogPost[];
}

export default function BlogSection({ blogPosts = [] }: BlogSectionProps) {
  if (!blogPosts || blogPosts.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 dark:bg-navy-950/60 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
          <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3">
            Knowledge Hub &amp; Technical Bulletins
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
            Engineering Insights &amp; Operational Standards
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            Stay updated with field-tested engineering methodologies in SCADA integration,
            hazardous-area safety compliance, and remote telemetry architectures.
          </p>
        </div>

        {/* Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.slug || String(post._id)}
              className="glass-panel rounded-2xl overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full bg-navy-950 overflow-hidden">
                  <Image
                    src={post.coverImage || "/images/industrial-facility.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase bg-navy-900/90 text-cyan-400 border border-cyan-500/30 backdrop-blur-sm">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </span>
                    {post.readTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-cyan-500" />
                        <span>{post.readTime}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-navy-950 dark:text-white mb-2 line-clamp-2 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0">
                <Link
                  href={post.slug ? `/blog/${post.slug}` : "#"}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 group-hover:translate-x-1 transition-all"
                >
                  <span>Read Technical Paper</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
