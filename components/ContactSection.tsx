"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { WebsiteSettings } from "@/models";

interface ContactSectionProps {
  settings?: WebsiteSettings | null;
}

const SOLUTIONS = [
  "V-SAT Satellite Communication Services",
  "SCADA Data Transfer & Remote Telemetry",
  "CCTV Surveillance & Explosion-Proof Video Systems",
  "Fire Alarm & Emergency Detection Systems",
  "Automatic Weather Stations (AWS) Telemetry",
  "Automatic Water Level Recorders (AWLR) & Flood Telemetry",
  "Automated Boom Barriers & Access Control Systems",
  "EPABX/PBX & Long-Range Microwave Links",
  "P2P / PML High-Throughput Wireless Radios",
  "IT Network Infrastructure, OFC Backbones & LAN Switching",
  "Industrial UPS & Uninterruptible Power Systems",
  "Energy Meter Installation & Real-Time Data Display",
  "Flow Meter Installation & Precise Flow Telemetry",
  "Comprehensive Annual Maintenance Contract (AMC)",
  "Non-Comprehensive Annual Maintenance Contract (AMC)",
  "Other Custom Turnkey Integration",
];

export default function ContactSection({ settings: initialSettings }: ContactSectionProps = {}) {
  const [clientSettings, setClientSettings] = useState<WebsiteSettings | null>(
    initialSettings || null
  );

  useEffect(() => {
    if (!initialSettings) {
      let isMounted = true;
      fetch("/api/settings")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (isMounted && data?.settings) {
            setClientSettings(data.settings);
          }
        })
        .catch(() => {});
      return () => {
        isMounted = false;
      };
    }
  }, [initialSettings]);

  const settings = initialSettings || clientSettings;

  const helpline = settings?.helpline || settings?.phone || "+91 7678561876";
  const helplineClean = helpline.replace(/\s+/g, "");

  const rawWhatsapp =
    settings?.whatsapp ||
    settings?.helpline ||
    settings?.phone ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    "918355976842";
  const waDigits = rawWhatsapp.replace(/\D/g, "");
  const waPhone = waDigits.length === 10 ? `91${waDigits}` : waDigits;
  const whatsappDisplay =
    waDigits.length === 10
      ? `+91 ${waDigits}`
      : waDigits.length === 12 && waDigits.startsWith("91")
      ? `+91 ${waDigits.slice(2)}`
      : rawWhatsapp;
  const whatsappUrl = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    "Hello CSD Enterprises, I would like to inquire about your turnkey solutions and services."
  )}`;

  const primaryPhone = settings?.phone || "+91 8355976842";
  const altPhone = settings?.altPhone;
  const emailAddr = settings?.email || "support@csdenterprises.in";
  const addressText =
    settings?.address ||
    "OM Plaza Commercial Complex, 60, 1st Floor, Nalasopara West, Mumbai, Maharashtra - 401203";

  const [formData, setFormData] = useState({
    fullName: "",
    workEmail: "",
    phone: "",
    organization: "",
    solution: SOLUTIONS[0],
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setFeedbackMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setFeedbackMessage(data.error || "Failed to submit inquiry. Please try again.");
        return;
      }

      setStatus("success");
      setFeedbackMessage(
        "Thank you. Your request for proposal has been logged with CSD Enterprises engineering office. An engineering consultant will review your specifications and contact you shortly."
      );
      setFormData({
        fullName: "",
        workEmail: "",
        phone: "",
        organization: "",
        solution: SOLUTIONS[0],
        message: "",
      });
    } catch {
      setStatus("error");
      setFeedbackMessage("Network error. Please email support@csdenterprises.in directly.");
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-navy-950/70 border-b border-slate-200 dark:border-navy-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Corporate Office Contact Details */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3 inline-block">
                Direct Engineering Inquiries &amp; 24*7 Support
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
                Initiate a Technical Consultation
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect directly with our senior automation, hydrometrology, and satcom architects.
                Whether drafting an RFQ for a hazardous process plant or expanding statewide telemetry,
                we provide rigorous proposals and turnkey execution.
              </p>
            </div>

            <div className="space-y-4">
              {/* Primary 24*7 Hotline */}
              <div className="p-4 rounded-xl glass-panel flex items-start gap-4 shadow-sm border border-red-500/30 bg-red-500/5">
                <div className="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                      24*7 Dedicated Operations Helpline
                    </h4>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                    <a
                      href={`tel:${helplineClean}`}
                      className="text-base font-extrabold text-navy-950 dark:text-white hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      {helpline}
                    </a>
                    {waPhone && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/30 transition-all btn-press"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat on WhatsApp</span>
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    Call helpline or message anytime on WhatsApp ({whatsappDisplay})
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Corporate Office Lines
                  </h4>
                  <div className="text-sm font-semibold text-navy-950 dark:text-white mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a
                      href={`tel:${primaryPhone.replace(/\s+/g, "")}`}
                      className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      {primaryPhone}
                    </a>
                    {altPhone && (
                      <>
                        <span>•</span>
                        <a
                          href={`tel:${altPhone.replace(/\s+/g, "")}`}
                          className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        >
                          {altPhone}
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Official Corporate Email
                  </h4>
                  <a
                    href={`mailto:${emailAddr}`}
                    className="text-sm font-semibold text-navy-950 dark:text-white mt-0.5 hover:text-red-600 dark:hover:text-red-400 transition-colors block"
                  >
                    {emailAddr}
                  </a>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-navy-800 border border-slate-200 dark:border-navy-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Corporate Headquarters
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-navy-950 dark:text-white mt-0.5">
                    {addressText}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500" />
                <span>Response SLA: Within 4 Business Hours for Industrial RFQs &amp; AMC</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>Standard NDA &amp; Industrial Confidentiality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Trust RFQ / Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-cyan-500/20 shadow-xl relative">
              <h3 className="text-xl sm:text-2xl font-bold text-navy-950 dark:text-white mb-2">
                Request for Proposal / Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
                Please complete the form below. All inquiries are saved.
              </p>

              {status === "success" && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500 mt-0.5" />
                  <div>{feedbackMessage}</div>
                </div>
              )}

              {status === "error" && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-sm flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <div>{feedbackMessage}</div>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                method="POST"
                action="/api/inquiries"
                className="space-y-4"
              >

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      name="workEmail"
                      required
                      placeholder="name@company.com"
                      value={formData.workEmail}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Organization / Company *
                    </label>
                    <input
                      type="text"
                      name="organization"
                      required
                      placeholder="e.g. Larsen & Toubro, IOCL"
                      value={formData.organization}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Solution Vertical of Interest *
                  </label>
                  <select
                    name="solution"
                    value={formData.solution}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                  >
                    {SOLUTIONS.map((sol) => (
                      <option key={sol} value={sol}>
                        {sol}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Project Scope / Technical Requirements *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Describe your plant or facility requirements, site locations, estimated timelines, or specific PLC/CCTV technical standards..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/25 transition-all duration-200 disabled:opacity-50 btn-press"
                >
                  {status === "loading" ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Inquiry to Server...</span>
                    </span>
                  ) : (
                    <>
                      <span>Submit Request for Proposal</span>
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
