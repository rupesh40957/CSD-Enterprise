"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Megaphone,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import ImageUploader from "./ImageUploader";

interface CtaData {
  _id?: string;
  badge: string;
  heading: string;
  highlightedText: string;
  description: string;
  primaryButtonText: string;
  primaryButtonUrl: string;
  secondaryButtonText: string;
  secondaryButtonUrl: string;
  backgroundImage: string;
  emergencyContactText: string;
  emergencyContactPhone: string;
  isActive: boolean;
}

const EMPTY_CTA: CtaData = {
  badge: "",
  heading: "",
  highlightedText: "",
  description: "",
  primaryButtonText: "",
  primaryButtonUrl: "",
  secondaryButtonText: "",
  secondaryButtonUrl: "",
  backgroundImage: "",
  emergencyContactText: "",
  emergencyContactPhone: "",
  isActive: true,
};

export default function CtaManager() {
  const [cta, setCta] = useState<CtaData>(EMPTY_CTA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCta = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cta");
      if (res.ok) {
        const data = await res.json();
        if (data.cta) {
          setCta(data.cta);
        }
      }
    } catch {
      showToast("error", "Failed to load CTA content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCta();
  }, [fetchCta]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/cta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cta),
      });
      if (res.ok) {
        showToast("success", "CTA content saved!");
        fetchCta();
      } else {
        const err = await res.json();
        showToast("error", err.error || "Save failed");
      }
    } catch {
      showToast("error", "Network error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-cyan-500" />
            Consultation CTA Banner
          </h2>
          <p className="text-sm text-slate-500 mt-1">Manage the bottom call-to-action section on the home page</p>
        </div>
      </div>

      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Badge Text</label>
            <input
              value={cta.badge}
              onChange={(e) => setCta({ ...cta, badge: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="e.g. Engineering Turnkey Excellence"
            />
          </div>
        </div>

        <ImageUploader
          label="CTA Banner Background Image"
          value={cta.backgroundImage || ""}
          onChange={(url) => setCta({ ...cta, backgroundImage: url })}
          helperText="Upload background visual for the consultation banner (e.g. 1920x600)"
          aspectRatio="banner"
        />

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Heading *</label>
          <input
            value={cta.heading}
            onChange={(e) => setCta({ ...cta, heading: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="Ready to Upgrade Your Industrial Infrastructure?"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Highlighted Text</label>
          <input
            value={cta.highlightedText}
            onChange={(e) => setCta({ ...cta, highlightedText: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
            placeholder="Partner with CSD Enterprises Today."
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Description *</label>
          <textarea
            value={cta.description}
            onChange={(e) => setCta({ ...cta, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none resize-y"
            placeholder="Write the CTA description..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Primary Button Text *</label>
            <input
              value={cta.primaryButtonText}
              onChange={(e) => setCta({ ...cta, primaryButtonText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Initiate Technical Consultation"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Primary Button URL *</label>
            <input
              value={cta.primaryButtonUrl}
              onChange={(e) => setCta({ ...cta, primaryButtonUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="#contact"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Secondary Button Text</label>
            <input
              value={cta.secondaryButtonText}
              onChange={(e) => setCta({ ...cta, secondaryButtonText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="Call Engineering Desk"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Secondary Button URL</label>
            <input
              value={cta.secondaryButtonUrl}
              onChange={(e) => setCta({ ...cta, secondaryButtonUrl: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="tel:+918355976842"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Emergency Contact Text</label>
            <input
              value={cta.emergencyContactText}
              onChange={(e) => setCta({ ...cta, emergencyContactText: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="24/7 Operations Helpline"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Emergency Contact Phone</label>
            <input
              value={cta.emergencyContactPhone}
              onChange={(e) => setCta({ ...cta, emergencyContactPhone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="+91 8355976842 / 9022248869"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={cta.isActive}
              onChange={(e) => setCta({ ...cta, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
            />
            <span className="text-sm font-medium">Active / Visible on Home Page</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-navy-800">
          <button onClick={() => fetchCta()} className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-navy-700 hover:bg-slate-50 dark:hover:bg-navy-800">
            Reset
          </button>
          <button onClick={handleSave} disabled={saving || !cta.heading || !cta.description || !cta.primaryButtonText} className="px-6 py-2 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save CTA Content
          </button>
        </div>
      </div>
    </div>
  );
}
