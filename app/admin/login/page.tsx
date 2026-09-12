"use client";

import React, { useState, Suspense } from "react";
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
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

function AdminLoginForm() {
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
        setError(data.error || "Authentication failed. Invalid email or passcode.");
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

  return (
    <div className="w-full max-w-md z-10 animate-fade-in-up">
      {/* Security Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/90 dark:border-red-500/25 relative overflow-hidden">
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        {/* Top Logo & Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-red-500/30 shadow-md shadow-red-500/10 flex items-center justify-center mb-3">
            <Image
              src="/logo/csd-logo.svg"
              alt="CSD Enterprises Logo"
              width={54}
              height={54}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-navy-950 dark:text-white flex items-center gap-2">
            <span className="text-red-600 dark:text-red-500">CSD</span>
            <span>Admin Gateway</span>
            <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Authorized Engineering &amp; Operations Portal
          </p>
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
            <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Administrator Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-email"
                name="email"
                type="email"
                required
                autoFocus
                autoComplete="username"
                placeholder="example@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:text-white transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Security Password / Passcode
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none dark:text-white transition-all"
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
            className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 btn-press transition-all duration-200 disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </span>
            ) : (
              "Authenticate & Access Admin Portal"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 tech-grid-vignette bg-slate-100 dark:bg-navy-950 transition-colors relative overflow-hidden">
      {/* Top Left: Back to Website */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 bg-white/90 dark:bg-navy-900/90 border border-slate-200/90 dark:border-navy-800 shadow-sm backdrop-blur-md transition-all hover:scale-105 btn-press"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
      </div>

      {/* Top Right: Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <Suspense fallback={<div className="text-sm text-slate-400">Loading Admin Portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
