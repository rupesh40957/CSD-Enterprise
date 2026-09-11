"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed.");
        setLoading(false);
        return;
      }

      router.push(redirectPath);
      router.refresh();
    } catch {
      setError("Network or server error during login.");
      setLoading(false);
    }
  };

  const handleAutoFillDemo = () => {
    setEmail("admin@csdenterprises.in");
    setPassword("AdminCSD@2026!Secure");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 tech-grid bg-slate-100 dark:bg-navy-950 transition-colors">
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-500 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        {/* Security Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-200 dark:border-cyan-500/20 relative overflow-hidden">
          {/* Top Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-slate-200 dark:border-cyan-500/30 shadow-md flex items-center justify-center mb-4">
              <Image
                src="/logo/csd-logo.png"
                alt="CSD Enterprises Logo"
                width={50}
                height={50}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-navy-950 dark:text-white flex items-center gap-2">
              <span>Admin Management</span>
              <ShieldCheck className="w-5 h-5 text-cyan-500" />
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Authorized Engineering &amp; Operations Personnel Only
            </p>
          </div>

          {/* Quick Credentials Info Box */}
          <div className="mb-6 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between gap-2">
            <div>
              <div className="font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Authorized Admin Credentials</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Email: <code className="font-mono text-cyan-500">admin@csdenterprises.in</code>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFillDemo}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-cyan-500 hover:bg-cyan-600 text-navy-950 shrink-0 transition-colors"
            >
              Auto-fill
            </button>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Administrator Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="admin@csdenterprises.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Security Password / Passcode
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter administrator password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-cyan-500 focus:outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  aria-label={showPassword ? "Hide passcode" : "Show passcode"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-md transition-all duration-200 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </span>
              ) : (
                "Authenticate & Access Admin Panel"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-navy-800/80 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Session is secured via signed HTTP-Only JSON Web Tokens.
              <br />
              All access attempts are rate-limited and protected on server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
