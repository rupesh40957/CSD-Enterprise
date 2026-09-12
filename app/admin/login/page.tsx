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
  KeyRound,
  Check,
  Copy,
  Sparkles,
  UserCheck,
  ShieldAlert,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const ADMIN_ACCOUNTS = [
  {
    id: "admin",
    label: "Master Admin",
    email: "admin@csdenterprises.in",
    password: "CSD#Admin94!mK8x",
    role: "superadmin",
  },
  {
    id: "support",
    label: "Support Operations",
    email: "support@csdenterprises.in",
    password: "CSD#Supp28*vR7q",
    role: "admin",
  },
];

function AdminLoginForm() {
  const [selectedAdminId, setSelectedAdminId] = useState<string>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [justAutoFilled, setJustAutoFilled] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const currentAdmin = ADMIN_ACCOUNTS.find((a) => a.id === selectedAdminId) || ADMIN_ACCOUNTS[0];

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

  const handleAutoFill = (acc: typeof ADMIN_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setShowPassword(true);
    setJustAutoFilled(true);
    setTimeout(() => setJustAutoFilled(false), 3000);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="w-full max-w-lg">
      {/* Security Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 dark:border-red-500/20 relative overflow-hidden">
        {/* Top Gradient Stripe */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        {/* Top Logo & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-red-500/30 shadow-md shadow-red-500/10 flex items-center justify-center mb-3">
            <Image
              src="/logo/csd-logo.svg"
              alt="CSD Enterprises Logo"
              width={54}
              height={54}
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-navy-950 dark:text-white flex items-center gap-2">
            <span className="text-red-600 dark:text-red-500">CSD</span>
            <span>Admin Gateway</span>
            <ShieldCheck className="w-5 h-5 text-red-600 dark:text-red-500" />
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Authorized Engineering &amp; Operations Portal
          </p>
        </div>

        {/* Dual Admin Selection & Credentials Helper */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 dark:bg-navy-900/90 border border-red-500/20 text-xs shadow-inner">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-navy-800">
            <div className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-red-500" />
              <span>Available Admin Accounts</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
              2 Accounts Configured
            </span>
          </div>

          {/* Account Selector Tabs */}
          <div className="grid grid-cols-2 gap-1.5 my-3 p-1 bg-white dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800">
            {ADMIN_ACCOUNTS.map((acc) => (
              <button
                key={acc.id}
                type="button"
                onClick={() => {
                  setSelectedAdminId(acc.id);
                  handleAutoFill(acc);
                }}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedAdminId === acc.id
                    ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="truncate">{acc.label}</span>
              </button>
            ))}
          </div>

          {/* Active Admin Details */}
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between bg-white dark:bg-navy-950/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-800">
              <span className="text-slate-500 dark:text-slate-400 font-sans text-xs">Email:</span>
              <div className="flex items-center gap-2">
                <code className="text-red-600 dark:text-red-400 font-semibold">{currentAdmin.email}</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentAdmin.email, "email")}
                  className="p-1 hover:text-red-500 text-slate-400 transition-colors"
                  title="Copy email"
                >
                  {copiedKey === "email" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-navy-950/80 px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-800">
              <span className="text-slate-500 dark:text-slate-400 font-sans text-xs">Generated Password:</span>
              <div className="flex items-center gap-2">
                <code className="text-red-600 dark:text-red-400 font-semibold">{currentAdmin.password}</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(currentAdmin.password, "password")}
                  className="p-1 hover:text-red-500 text-slate-400 transition-colors"
                  title="Copy password"
                >
                  {copiedKey === "password" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 1-Click Auto Fill Action */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Login ke bad password change window aayega</span>
            </div>
            <button
              type="button"
              onClick={() => handleAutoFill(currentAdmin)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl shrink-0 transition-all flex items-center gap-1.5 shadow-sm ${
                justAutoFilled
                  ? "bg-emerald-500 text-white scale-105"
                  : "bg-red-600 hover:bg-red-500 text-white active:scale-95"
              }`}
            >
              {justAutoFilled ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Auto-filled!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Auto-fill {currentAdmin.label}</span>
                </>
              )}
            </button>
          </div>
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
                placeholder="admin@csdenterprises.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-red-500 focus:outline-none dark:text-white transition-colors"
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
                className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:border-red-500 focus:outline-none dark:text-white transition-colors"
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
            className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/25 transition-all duration-200 disabled:opacity-50 mt-2"
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

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-navy-800/80 text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Signed HTTP-Only JWT Session with Database Verification.
            <br />
            Includes mandatory password change workflow for temporary keys.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 tech-grid bg-slate-100 dark:bg-navy-950 transition-colors">
      <div className="absolute top-6 left-6 flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Website</span>
        </Link>
      </div>

      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <Suspense fallback={<div className="text-sm text-slate-400">Loading...</div>}>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
