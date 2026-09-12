"use client";

import React, { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  KeyRound,
  X,
  Sparkles,
} from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onSuccess: () => void;
  isForced?: boolean;
  userEmail?: string;
}

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSuccess,
  isForced = false,
  userEmail,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  // Strength score
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const strengthCount = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!hasMinLength) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (!hasUpper || !hasLower || !hasNumber) {
      setError("Password must include uppercase, lowercase letters, and a number.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update password.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        if (onClose) onClose();
      }, 1500);
    } catch {
      setError("Network or server error while updating password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-navy-700/80 p-6 sm:p-8 relative overflow-hidden">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy-950 dark:text-white flex items-center gap-2">
                <span>{isForced ? "Security Setup: Set New Password" : "Change Admin Password"}</span>
              </h3>
              {userEmail && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  {userEmail}
                </p>
              )}
            </div>
          </div>

          {!isForced && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Forced notice banner */}
        {isForced && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-amber-500" />
            <div>
              <span className="font-bold block">First-Time Temporary Password in Use</span>
              For security compliance, you must set a permanent private password to continue.
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="py-8 text-center space-y-3 animate-in zoom-in-95">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-navy-950 dark:text-white">
              Password Successfully Updated!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your new password is saved and active. Returning to dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Password (Temporary/Generated)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showCurrent ? "text" : "password"}
                  required
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 focus:border-red-500 focus:outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showNew ? "text" : "password"}
                  required
                  placeholder="Minimum 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 focus:border-red-500 focus:outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength bar */}
              {newPassword.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  <div className="flex gap-1 h-1.5 w-full bg-slate-200 dark:bg-navy-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        strengthCount <= 2
                          ? "w-1/3 bg-rose-500"
                          : strengthCount <= 4
                          ? "w-2/3 bg-amber-500"
                          : "w-full bg-emerald-500"
                      }`}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    <span>Strength: {strengthCount <= 2 ? "Weak" : strengthCount <= 4 ? "Moderate" : "Strong"}</span>
                    <span className="flex items-center gap-1">
                      {hasMinLength && hasUpper && hasLower && hasNumber ? (
                        <span className="text-emerald-500 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Requirements met
                        </span>
                      ) : (
                        "8+ chars, upper, lower, number"
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-700 focus:border-red-500 focus:outline-none dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Save &amp; Activate Password</span>
                  </>
                )}
              </button>

              {!isForced && onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
