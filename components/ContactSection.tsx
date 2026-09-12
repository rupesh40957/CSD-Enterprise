"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

const SOLUTIONS = [
  "Industrial Automation (PLC/SCADA/DCS)",
  "Digitization & Industrial IoT",
  "CCTV Surveillance & Explosion-Proof Systems",
  "Sensorization & Hydrometrology (AWS)",
  "IT Network & Infrastructure (LAN/OFC/UPS)",
  "Manpower Facility & Engineering Services",
  "Other / Custom Turnkey Integration",
];

export default function ContactSection() {
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
              <span className="px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-3 inline-block">
                Direct Engineering Inquiries
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-950 dark:text-white tracking-tight">
                Initiate a Technical Consultation
              </h2>
              <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                Connect directly with our senior automation and infrastructure architects.
                Whether drafting an RFQ for a hazardous process plant or expanding state telecom
                infrastructure, we provide rigorous engineering proposals.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl glass-panel flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Corporate Headquarters
                  </h4>
                  <p className="text-sm font-semibold text-navy-950 dark:text-white mt-0.5">
                    OM Plaza Commercial Complex, 60, 1st Floor, Nalasopara West, Mumbai, Maharashtra - 401203
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Direct Phone Support
                  </h4>
                  <div className="text-sm font-semibold text-navy-950 dark:text-white mt-0.5 space-x-3">
                    <a href="tel:+918355976842" className="hover:text-cyan-500 transition-colors">
                      +91 8355976842
                    </a>
                    <span>•</span>
                    <a href="tel:9022248869" className="hover:text-cyan-500 transition-colors">
                      9022248869
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl glass-panel flex items-start gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-500 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Official Corporate Email
                  </h4>
                  <a
                    href="mailto:support@csdenterprises.in"
                    className="text-sm font-semibold text-navy-950 dark:text-white mt-0.5 hover:text-cyan-500 transition-colors block"
                  >
                    support@csdenterprises.in
                  </a>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 dark:bg-navy-900/60 border border-slate-200 dark:border-navy-800 text-xs text-slate-600 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-500" />
                <span>Response SLA: Within 4 Business Hours for Industrial RFQs</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>Standard NDA &amp; Industrial Confidentiality Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-Trust RFQ / Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-200 dark:border-cyan-500/20 shadow-xl relative">
              <h3 className="text-xl sm:text-2xl font-bold text-navy-950 dark:text-white mb-2">
                Request for Proposal (RFP) / B2B Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
                Please complete the form below. All inquiries are saved to our secure database for engineering review.
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
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md transition-all duration-200 disabled:opacity-50"
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
