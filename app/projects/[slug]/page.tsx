import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDatabase } from "@/lib/mongodb";
import { Project, WebsiteSettings } from "@/models";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import {
  ArrowLeft,
  Building2,
  MapPin,
  CheckCircle,
  Clock,
  ShieldCheck,
  PhoneCall,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function getProjectData(slug: string) {
  try {
    const db = await getDatabase();
    const [project, settings] = await Promise.all([
      db.collection<Project>("projects").findOne({ slug, active: true }),
      db.collection<WebsiteSettings>("websiteSettings").findOne({}),
    ]);
    function serialize<T>(item: T): T {
      return JSON.parse(JSON.stringify(item));
    }
    return {
      project: project ? serialize(project) : null,
      settings: settings ? serialize(settings) : null,
    };
  } catch {
    return { project: null, settings: null };
  }
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const { project, settings } = await getProjectData(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar settings={settings} />

      <article className="flex-1 pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Back Link */}
          <div className="mb-8">
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Featured Projects</span>
            </Link>
          </div>

          {/* Header Metadata */}
          <div className="space-y-4 mb-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wide uppercase bg-navy-900 text-cyan-400 border border-cyan-500/30">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-md text-xs font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  Landmark Enterprise Project
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
              {project.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-600 dark:text-slate-400 pt-2 border-y border-slate-200 dark:border-navy-800 py-3">
              <div className="flex items-center gap-1.5 font-semibold text-cyan-600 dark:text-cyan-400">
                <Building2 className="w-4 h-4" />
                <span>Client: {project.client}</span>
              </div>
              {project.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-500" />
                  <span>{project.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>Turnkey Commissioned</span>
              </div>
            </div>
          </div>

          {/* Project Cover Image */}
          <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-200 dark:border-cyan-500/20">
            <Image
              src={project.image || "/images/industrial-facility.jpg"}
              alt={project.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <div className="lg:col-span-7 space-y-6">
              <div className="p-8 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
                <h2 className="text-lg font-bold text-navy-950 dark:text-white mb-3">
                  Project Background &amp; Operational Challenges
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="p-8 rounded-2xl glass-panel shadow-sm border border-slate-200 dark:border-navy-800">
                <h2 className="text-lg font-bold text-navy-950 dark:text-white mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-500" />
                  <span>Engineering Scope of Work</span>
                </h2>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{project.scope}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-slate-100 dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white">
                  Execution Highlights
                </h3>
                <ul className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Complete turnkey engineering and commissioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>Adherence to PESO and statutory safety mandates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>On-site operator enablement and training</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                    <span>24/7 post-deployment warranty support</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white space-y-4 shadow-lg">
                <h3 className="text-base font-bold">Have a similar project?</h3>
                <p className="text-xs text-white/90 leading-relaxed">
                  Request a technical site evaluation and custom turnkey proposal from our engineering office.
                </p>
                <Link
                  href="/#contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs text-navy-950 bg-white hover:bg-slate-100 shadow-md transition-all"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-600" />
                  <span>Request Engineering Proposal</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      <FloatingWhatsApp />
      <Footer settings={settings} />
    </main>
  );
}
