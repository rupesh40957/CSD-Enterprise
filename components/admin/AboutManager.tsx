"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Info,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Star,
  Users,
  Cpu,
  Target,
  Award,
  Zap,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";
import { AboutContent, AboutCard, AboutCoreValue } from "@/models";
import ImageUploader from "./ImageUploader";

const ICON_OPTIONS = [
  { label: "Shield / Security", value: "ShieldCheck", icon: ShieldCheck },
  { label: "Star / Excellence", value: "Star", icon: Star },
  { label: "Users / Team", value: "Users", icon: Users },
  { label: "CPU / Tech", value: "Cpu", icon: Cpu },
  { label: "Target / Vision", value: "Target", icon: Target },
  { label: "Award / Quality", value: "Award", icon: Award },
  { label: "Zap / Speed", value: "Zap", icon: Zap },
];

export const DEFAULT_ABOUT_CARDS: AboutCard[] = [
  {
    id: "establishment",
    title: "Establishment",
    description:
      "We are system integrator was formed in 2019 and dedicated to delivering exceptional products and services to our clients offshore and onshore.",
    image: "/images/about/establishment.jpg",
  },
  {
    id: "vision",
    title: "Our Vision",
    description:
      "Our vision is to provide top-notch services & we strive to provide outstanding solutions that exceed client expectations and foster long-term relationships.",
    image: "/images/about/vision.jpg",
  },
  {
    id: "approach",
    title: "Our Approach",
    description:
      "We take a personalized approach to each client's needs, working closely with them to understand their unique challenges and develop customized solutions.",
    image: "/images/about/approach.svg",
  },
  {
    id: "expertise",
    title: "Our Expertise",
    description:
      "We have experienced and expert professionals in PLC, SCADA, CCTV Surveillance System, IT & Networking Infrastructure, Hydrometeorology & Satcom for offshore & onshore locations.",
    image: "/images/about/expertise.svg",
  },
  {
    id: "management",
    title: "Management & Employees",
    description:
      "Our management provides strategic direction, while our employees are dedicated to executing our vision with precision and care. Together, we work collaboratively to drive innovation, quality, and customer satisfaction.",
    image: "/images/about/management.svg",
  },
  {
    id: "core-values",
    title: "Our Core Values",
    description:
      "Upholding the highest ethical standards, operational safety, and engineering excellence across every mission-critical deployment.",
    image: "/images/about/core-values.svg",
    list: ["Integrity", "Excellence", "Collaboration", "Innovation"],
  },
];

const DEFAULT_ABOUT: AboutContent = {
  badge: "Company Background & Ethos",
  heading: "Engineering Precision Built for India's Critical Infrastructure",
  description:
    "Formed in 2019, CSD Enterprises serves as an elite industrial system integrator and turnkey engineering partner across offshore deepwater facilities and onshore industrial plants nationwide.",
  visionTitle: "Our Vision & Strategic Approach",
  visionDescription:
    "We take a personalized, hands-on engineering approach to every client requirement—working closely with plant engineers, operations chiefs, and defense coordinators to deploy tailored automation, surveillance, and telemetry systems.",
  experienceBadge: "Established 2019",
  statsOffshore: "Offshore Deepwater",
  statsOffshoreSub: "Mumbai High TSAT SCADA",
  statsOnshore: "Onshore Industrial",
  statsOnshoreSub: "Power, Oil, Gas & Police",
  bannerImage: "",
  establishmentImage: "/images/about/establishment.jpg",
  visionImage: "/images/about/vision.jpg",
  approachImage: "/images/about/approach.svg",
  expertiseImage: "/images/about/expertise.svg",
  managementImage: "/images/about/management.svg",
  coreValuesImage: "/images/about/core-values.svg",
  cards: DEFAULT_ABOUT_CARDS,
  coreValues: [
    {
      icon: "ShieldCheck",
      title: "Integrity",
      description:
        "Transparent engineering practices, uncompromised industrial safety compliance, and ethical client engagements across hazardous and defense facilities.",
      highlight: "Safety & Compliance First",
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-400",
    },
    {
      icon: "Star",
      title: "Excellence",
      description:
        "Rigorous adherence to global PLC/DCS, SCADA, and telecom engineering standards, ensuring fault-tolerant performance in high-stakes environments.",
      highlight: "Industrial-Grade Reliability",
      color: "from-amber-500/20 to-orange-500/20 text-amber-400",
    },
    {
      icon: "Users",
      title: "Collaboration",
      description:
        "Long-term engineering partnerships with India's largest PSUs, EPC contractors, telecom pioneers, and state law enforcement agencies.",
      highlight: "Trusted Partner Ecosystem",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-400",
    },
    {
      icon: "Cpu",
      title: "Innovation",
      description:
        "Pioneering IoT telemetry, solar-powered hydrometrology Automatic Weather Stations, and satellite earth stations for remote automated intelligence.",
      highlight: "Next-Gen Telemetry & IoT",
      color: "from-purple-500/20 to-cyan-500/20 text-purple-400",
    },
  ],
};

export default function AboutManager() {
  const [about, setAbout] = useState<AboutContent>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAbout = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/about");
      if (res.ok) {
        const data = await res.json();
        if (data.about) {
          // If cards are not in DB, seed with DEFAULT_ABOUT_CARDS
          const mergedCards =
            data.about.cards && data.about.cards.length > 0
              ? data.about.cards
              : DEFAULT_ABOUT_CARDS.map((c) => {
                  if (c.id === "establishment" && data.about.establishmentImage) {
                    return { ...c, image: data.about.establishmentImage };
                  }
                  if (c.id === "vision" && data.about.visionImage) {
                    return { ...c, image: data.about.visionImage };
                  }
                  if (c.id === "approach" && data.about.approachImage) {
                    return { ...c, image: data.about.approachImage };
                  }
                  if (c.id === "expertise" && data.about.expertiseImage) {
                    return { ...c, image: data.about.expertiseImage };
                  }
                  if (c.id === "management" && data.about.managementImage) {
                    return { ...c, image: data.about.managementImage };
                  }
                  if (c.id === "core-values" && data.about.coreValuesImage) {
                    return { ...c, image: data.about.coreValuesImage };
                  }
                  return c;
                });

          setAbout({
            ...DEFAULT_ABOUT,
            ...data.about,
            cards: mergedCards,
          });
        }
      }
    } catch {
      showToast("error", "Failed to load About content from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Map cards back to specific images as well for backward compatibility
      const updatedPayload: AboutContent = {
        ...about,
        establishmentImage: about.cards?.[0]?.image || about.establishmentImage,
        visionImage: about.cards?.[1]?.image || about.visionImage,
        approachImage: about.cards?.[2]?.image || about.approachImage,
        expertiseImage: about.cards?.[3]?.image || about.expertiseImage,
        managementImage: about.cards?.[4]?.image || about.managementImage,
        coreValuesImage: about.cards?.[5]?.image || about.coreValuesImage,
      };

      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("success", "About Us content & images saved and live on website!");
        fetchAbout();
      } else {
        showToast("error", data.error || "Failed to update About content.");
      }
    } catch {
      showToast("error", "Network error while saving.");
    } finally {
      setSaving(false);
    }
  };

  const handleCardFieldChange = (index: number, field: keyof AboutCard, value: unknown) => {
    const cards = [...(about.cards || DEFAULT_ABOUT_CARDS)];
    cards[index] = { ...cards[index], [field]: value };
    setAbout({ ...about, cards });
  };

  const handleResetCardImage = (index: number) => {
    const defaultImg = DEFAULT_ABOUT_CARDS[index]?.image || "/images/about/establishment.jpg";
    handleCardFieldChange(index, "image", defaultImg);
    showToast("success", `Card #${index + 1} image reset to default.`);
  };

  const handleCoreValueChange = (index: number, field: keyof AboutCoreValue, value: string) => {
    const updated = [...about.coreValues];
    updated[index] = { ...updated[index], [field]: value };
    setAbout({ ...about, coreValues: updated });
  };

  const handleAddCoreValue = () => {
    const newPillar: AboutCoreValue = {
      icon: "ShieldCheck",
      title: "New Value Pillar",
      description: "Description of the engineering standard or core commitment.",
      highlight: "Excellence & Precision",
      color: "from-blue-500/20 to-cyan-500/20 text-cyan-400",
    };
    setAbout({ ...about, coreValues: [...about.coreValues, newPillar] });
  };

  const handleRemoveCoreValue = (index: number) => {
    if (about.coreValues.length <= 1) {
      showToast("error", "Must keep at least 1 core value.");
      return;
    }
    const updated = about.coreValues.filter((_, i) => i !== index);
    setAbout({ ...about, coreValues: updated });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
        <p className="text-xs text-slate-500 dark:text-slate-400">Loading About Content &amp; Images...</p>
      </div>
    );
  }

  const currentCards = about.cards && about.cards.length > 0 ? about.cards : DEFAULT_ABOUT_CARDS;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold animate-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0 shadow-sm">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-navy-950 dark:text-white">
              About Section &amp; Visual Images Manager
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Upload and manage the images, titles, descriptions, and core values displayed in the About Us section on the homepage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/#about"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-navy-800 hover:bg-slate-200 dark:hover:bg-navy-700 transition-colors"
          >
            <span>View Live Section</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/25 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save About Content &amp; Images</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Main Section Header Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white border-b border-slate-100 dark:border-navy-800 pb-3">
            <Sparkles className="w-4 h-4 text-red-600 dark:text-red-500" />
            <span>1. Section Header &amp; Executive Summary</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Pill Badge Text
              </label>
              <input
                type="text"
                required
                value={about.badge}
                onChange={(e) => setAbout({ ...about, badge: e.target.value })}
                placeholder="e.g. Company Background & Ethos"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Experience / Year Badge
              </label>
              <input
                type="text"
                required
                value={about.experienceBadge}
                onChange={(e) => setAbout({ ...about, experienceBadge: e.target.value })}
                placeholder="e.g. Established 2019"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Main Section Heading
            </label>
            <input
              type="text"
              required
              value={about.heading}
              onChange={(e) => setAbout({ ...about, heading: e.target.value })}
              placeholder="e.g. About Us"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Comprehensive Company Description
            </label>
            <textarea
              rows={3}
              required
              value={about.description}
              onChange={(e) => setAbout({ ...about, description: e.target.value })}
              placeholder="Detailed company background, credentials, and capabilities..."
              className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
            />
          </div>
        </div>

        {/* Section 2: Visual Cards & Image Uploading Section */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-navy-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
              <ImageIcon className="w-4 h-4 text-red-600 dark:text-red-500" />
              <span>2. About Us Cards &amp; Image Uploading ({currentCards.length} Cards)</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Upload custom images (JPG, PNG, WebP, SVG). Each card renders a circular image frame on the homepage.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCards.map((card, idx) => (
              <div
                key={card.id || idx}
                className="flex flex-col p-5 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 hover:border-red-500/40 transition-colors shadow-sm space-y-4"
              >
                {/* Header Badge & Reset */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 uppercase tracking-wider">
                      Card #{idx + 1}
                    </span>
                    <span className="text-xs font-bold text-navy-950 dark:text-white">
                      {card.title || `Card ${idx + 1}`}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleResetCardImage(idx)}
                    className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Reset image to default"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* Circular Live Preview Matching Frontend */}
                <div className="flex flex-col items-center justify-center pt-2">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-slate-200 dark:border-navy-700 shadow-md bg-white dark:bg-navy-900 group">
                    {card.image ? (
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-2 font-mono truncate max-w-[200px]">
                    {card.image || "No image set"}
                  </span>
                </div>

                {/* Card Title Input */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Card Title
                  </label>
                  <input
                    type="text"
                    required
                    value={card.title}
                    onChange={(e) => handleCardFieldChange(idx, "title", e.target.value)}
                    placeholder="e.g. Establishment"
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white font-semibold"
                  />
                </div>

                {/* Card Description */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Description Text
                  </label>
                  <textarea
                    rows={3}
                    value={card.description}
                    onChange={(e) => handleCardFieldChange(idx, "description", e.target.value)}
                    placeholder="Enter card description..."
                    className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
                  />
                </div>

                {/* Image Uploader Component */}
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Card Image Upload</span>
                    <span className="text-[10px] text-slate-400">Drag &amp; Drop / Browse</span>
                  </label>

                  <ImageUploader
                    value={card.image}
                    onChange={(url) => handleCardFieldChange(idx, "image", url)}
                    helperText="Upload JPG, PNG, WebP or SVG (max 10MB)"
                    aspectRatio="square"
                    previewHeight="h-28"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Strategic Vision & Footprint Stats */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white border-b border-slate-100 dark:border-navy-800 pb-3">
            <Target className="w-4 h-4 text-red-600 dark:text-red-500" />
            <span>3. Strategic Vision &amp; Operational Footprint</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Vision Section Title
              </label>
              <input
                type="text"
                required
                value={about.visionTitle}
                onChange={(e) => setAbout({ ...about, visionTitle: e.target.value })}
                placeholder="e.g. Our Vision"
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Vision Narrative Description
              </label>
              <textarea
                rows={2}
                required
                value={about.visionDescription}
                onChange={(e) => setAbout({ ...about, visionDescription: e.target.value })}
                placeholder="Explain the company vision..."
                className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                Offshore Scope Metric
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  value={about.statsOffshore}
                  onChange={(e) => setAbout({ ...about, statsOffshore: e.target.value })}
                  placeholder="e.g. Offshore"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subtitle / Scope</label>
                <input
                  type="text"
                  value={about.statsOffshoreSub}
                  onChange={(e) => setAbout({ ...about, statsOffshoreSub: e.target.value })}
                  placeholder="e.g. CCTV Surveillance System, IT Infrastructure"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
              <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider block">
                Onshore Scope Metric
              </span>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  value={about.statsOnshore}
                  onChange={(e) => setAbout({ ...about, statsOnshore: e.target.value })}
                  placeholder="e.g. Onshore"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Subtitle / Scope</label>
                <input
                  type="text"
                  value={about.statsOnshoreSub}
                  onChange={(e) => setAbout({ ...about, statsOnshoreSub: e.target.value })}
                  placeholder="e.g. Hydrometeorology & Satcom"
                  className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Core Pillars / Values */}
        <div className="p-6 rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-navy-950 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-red-600 dark:text-red-500" />
              <span>4. Core Values &amp; Engineering Pillars ({about.coreValues.length})</span>
            </div>
            <button
              type="button"
              onClick={handleAddCoreValue}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 hover:bg-red-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Value Pillar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {about.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-red-600 dark:text-red-400">
                    Pillar #{idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCoreValue(idx)}
                    className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                    title="Remove Pillar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={val.title}
                      onChange={(e) => handleCoreValueChange(idx, "title", e.target.value)}
                      placeholder="e.g. Integrity"
                      className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">Icon</label>
                    <select
                      value={val.icon}
                      onChange={(e) => handleCoreValueChange(idx, "icon", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Highlight Badge</label>
                  <input
                    type="text"
                    required
                    value={val.highlight}
                    onChange={(e) => handleCoreValueChange(idx, "highlight", e.target.value)}
                    placeholder="e.g. Safety & Compliance First"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={val.description}
                    onChange={(e) => handleCoreValueChange(idx, "description", e.target.value)}
                    placeholder="Describe this core commitment..."
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 focus:border-red-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/25 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving All About Content &amp; Images...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All About Content &amp; Images</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
