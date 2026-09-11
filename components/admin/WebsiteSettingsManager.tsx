"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Save, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { WebsiteSettings } from "@/models";
import ImageUploader from "./ImageUploader";

export default function WebsiteSettingsManager() {
  const [settings, setSettings] = useState<WebsiteSettings>({
    companyName: "CSD Enterprises",
    tagline: "Unit of CSD Automation & Technologies",
    logo: "/logo/csd-logo.png",
    favicon: "/logo/csd-favicon.png",
    phone: "+91 8355976842",
    altPhone: "9022248869",
    email: "support@csdenterprises.in",
    address: "OM Plaza Commercial Complex, 60, 1st Floor, Nalasopara West, Mumbai, Maharashtra - 401203",
    workingHours: "Mon – Sat: 9:00 AM – 7:00 PM (24/7 On-Call Support)",
    googleMapsUrl: "https://maps.google.com",
    facebook: "https://www.facebook.com/profile.php?id=100007821287704",
    twitter: "https://www.x.com/@Shambhu86728236",
    linkedin: "https://www.linkedin.com/company/csd-enterprises",
    whatsapp: "918355976842",
    defaultSeoTitle: "CSD Enterprises | Industrial Automation & System Integration",
    defaultSeoDescription: "Delivering mission-critical PLC/SCADA, CCTV Surveillance, and Satcom solutions across India since 2019.",
    copyrightText: "Copyright © 2019–2026 CSD Enterprises. All Rights Reserved.",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load settings." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: "Website settings saved successfully!" });
      } else {
        setFeedback({ type: "error", message: data.error || "Failed to save settings." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error while saving." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">
            Global Website Settings &amp; Company Branding
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure official brand assets, company logo, contact helplines, address, and SEO defaults.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchSettings}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
            title="Reload settings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Identity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white pb-2 border-b border-slate-100 dark:border-navy-800">
            Brand Identity &amp; Logo
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <ImageUploader
              label="Active Company Logo"
              value={settings.logo || ""}
              onChange={(url) => setSettings((prev) => ({ ...prev, logo: url || "/logo/csd-logo.png" }))}
              helperText="Upload PNG, SVG or WebP logo file (transparent background recommended)"
              previewHeight="h-28"
            />
            <ImageUploader
              label="Browser Favicon"
              value={settings.favicon || ""}
              onChange={(url) => setSettings((prev) => ({ ...prev, favicon: url }))}
              helperText="Small square icon (.png, .svg, .ico) displayed on browser tab"
              aspectRatio="square"
              previewHeight="h-28"
            />
          </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Company Legal Name *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={settings.companyName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Brand Tagline / Division *
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    required
                    value={settings.tagline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
                  />
                </div>
              </div>
        </div>

        {/* Contact Information */}
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white pb-2 border-b border-slate-100 dark:border-navy-800">
            Corporate Office &amp; Operations Helplines
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Phone *
              </label>
              <input
                type="text"
                name="phone"
                required
                value={settings.phone}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Alternate Phone
              </label>
              <input
                type="text"
                name="altPhone"
                value={settings.altPhone || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={settings.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Corporate Address *
              </label>
              <textarea
                name="address"
                rows={2}
                required
                value={settings.address}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Working Hours &amp; SLA *
              </label>
              <textarea
                name="workingHours"
                rows={2}
                required
                value={settings.workingHours}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Social Links & WhatsApp */}
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white pb-2 border-b border-slate-100 dark:border-navy-800">
            Social Networks &amp; WhatsApp
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp Number (E.164 without +)
              </label>
              <input
                type="text"
                name="whatsapp"
                value={settings.whatsapp || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Facebook Profile
              </label>
              <input
                type="text"
                name="facebook"
                value={settings.facebook || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                X / Twitter
              </label>
              <input
                type="text"
                name="twitter"
                value={settings.twitter || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                LinkedIn Company Page
              </label>
              <input
                type="text"
                name="linkedin"
                value={settings.linkedin || ""}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Global SEO Defaults */}
        <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-navy-950 dark:text-white pb-2 border-b border-slate-100 dark:border-navy-800">
            SEO &amp; Open Graph Defaults
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Default SEO Title *
            </label>
            <input
              type="text"
              name="defaultSeoTitle"
              required
              value={settings.defaultSeoTitle}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Default SEO Meta Description *
            </label>
            <textarea
              name="defaultSeoDescription"
              rows={2}
              required
              value={settings.defaultSeoDescription}
              onChange={handleChange}
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 focus:border-cyan-500 focus:outline-none dark:text-white resize-none"
            />
          </div>

          <ImageUploader
            label="Default Social Share Image (OpenGraph / Twitter Preview)"
            value={settings.defaultSeoImage || ""}
            onChange={(url) => setSettings((prev) => ({ ...prev, defaultSeoImage: url }))}
            helperText="Preview image shown when sharing links on LinkedIn, WhatsApp, or X (Recommended: 1200x630)"
            aspectRatio="banner"
            previewHeight="h-28"
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-navy-950 bg-cyan-400 hover:bg-cyan-300 shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save All Website Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
