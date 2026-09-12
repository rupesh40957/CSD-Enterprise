"use client";

import React, { useState } from "react";
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  Server,
  Lock,
} from "lucide-react";

interface DatabaseHealthProps {
  dbConnected: boolean;
  counts: {
    totalInquiries: number;
    subscribers: number;
    projects: number;
  };
  onRefresh: () => void;
}

export default function DatabaseHealth({
  dbConnected,
  counts,
  onRefresh,
}: DatabaseHealthProps) {
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<string>(new Date().toLocaleTimeString());
  const [latency, setLatency] = useState<number | null>(null);

  const handleHealthCheck = async () => {
    setChecking(true);
    const start = performance.now();
    try {
      const res = await fetch("/api/health");
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setLastChecked(new Date().toLocaleTimeString());
      onRefresh();
    } catch {
      setLatency(null);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              dbConnected
                ? "bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
                : "bg-rose-500/15 text-rose-500 border border-rose-500/30"
            }`}
          >
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-navy-950 dark:text-white">
                DATABASE Cluster Health
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  dbConnected
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/15 text-rose-600 dark:text-rose-400"
                }`}
              >
                {dbConnected ? "Connected & Healthy" : "Connection Issue"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Database: <code className="font-mono text-cyan-500">csd_enterprises</code> • Last check: {lastChecked}
              {latency !== null && ` • Latency: ${latency}ms`}
            </p>
          </div>
        </div>

        <button
          onClick={handleHealthCheck}
          disabled={checking}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-sm transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`} />
          <span>{checking ? "Pinging Database..." : "Test Connection"}</span>
        </button>
      </div>

      {/* Collection Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-navy-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Collection: inquiries
          </div>
          <div className="text-2xl font-black text-navy-950 dark:text-white">
            {counts.totalInquiries}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Indexed by: <code className="font-mono text-cyan-500">createdAt, status</code>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-navy-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Collection: subscribers
          </div>
          <div className="text-2xl font-black text-navy-950 dark:text-white">
            {counts.subscribers}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Unique index: <code className="font-mono text-cyan-500">email</code>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-slate-200 dark:border-navy-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Collection: projects
          </div>
          <div className="text-2xl font-black text-navy-950 dark:text-white">
            {counts.projects}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Compound index: <code className="font-mono text-cyan-500">active, featured</code>
          </div>
        </div>
      </div>

      {/* Security Architecture Verification Box */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-navy-800 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          <span>Security Compliance &amp; Isolation Audit</span>
        </h4>

        <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Zero-Leak Server Isolation:</strong> Database connection credentials (<code className="font-mono text-slate-400">MONGODB_URI</code>), password hashes, and JWT keys are restricted exclusively to server-side Route Handlers.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Secure HTTP-Only Session:</strong> Admin sessions use signed HS256 tokens in <code className="font-mono text-slate-400">httpOnly: true, sameSite: &quot;strict&quot;</code> cookies, preventing XSS token interception.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Server-Side Rate Limiting:</strong> In-memory sliding window rate limiters protect authentication endpoints and public inquiry forms against brute-force attacks and abuse.
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              <strong>Strict Schema Validation:</strong> All user payloads are strictly validated on both client and server via Zod schemas with sanitized string transforms.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
