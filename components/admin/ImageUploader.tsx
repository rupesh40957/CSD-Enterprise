"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  X,
  RefreshCw,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  FileImage,
  Copy,
} from "lucide-react";

export interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  helperText?: string;
  aspectRatio?: "square" | "video" | "banner" | "auto";
  previewHeight?: string;
  className?: string;
  access?: "public" | "private";
}

export default function ImageUploader({
  value,
  onChange,
  label,
  required = false,
  helperText,
  aspectRatio = "auto",
  previewHeight = "h-36",
  className = "",
  access = "public",
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadFile = async (file: File) => {
    // Validate client-side
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, WebP, SVG, GIF)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large (max 10MB). Please select a smaller image.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("alt", file.name);
      formData.append("access", access);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      setShowUrlInput(false);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleUploadFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUploadFile(files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyManualUrl = () => {
    if (manualUrl.trim()) {
      onChange(manualUrl.trim());
      setManualUrl("");
      setShowUrlInput(false);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label & URL toggle */}
      <div className="flex items-center justify-between">
        {label && (
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? "Back to File Upload" : "Or paste URL"}</span>
        </button>
      </div>

      {/* Manual URL Input drawer */}
      {showUrlInput && (
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg or /images/..."
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-navy-900 border border-slate-300 dark:border-navy-700 focus:outline-none focus:border-cyan-500 dark:text-white"
            />
            <button
              type="button"
              onClick={handleApplyManualUrl}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Image Display Card OR Upload Dropzone */}
      {value ? (
        <div className="relative rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 p-3 flex flex-col sm:flex-row items-center gap-3">
          {/* Thumbnail preview */}
          <div
            className={`relative ${previewHeight} w-full sm:w-44 rounded-lg overflow-hidden bg-navy-900 border border-slate-200 dark:border-navy-800 shrink-0 flex items-center justify-center`}
          >
            {value.startsWith("/") || value.startsWith("http") ? (
              <Image
                src={value}
                alt={label || "Uploaded Image"}
                fill
                sizes="(max-width: 640px) 100vw, 200px"
                className="object-contain p-1"
                onError={(e) => {
                  // Fallback if image fails to render
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <FileImage className="w-8 h-8 text-slate-400" />
            )}
          </div>

          {/* Details & Action Buttons */}
          <div className="flex-1 min-w-0 space-y-2 w-full">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                <CheckCircle2 className="w-3 h-3" /> Image Selected
              </span>
            </div>

            <div className="flex items-center gap-1.5 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-lg px-2.5 py-1 text-xs font-mono text-slate-600 dark:text-slate-300">
              <span className="truncate flex-1" title={value}>
                {value}
              </span>
              <button
                type="button"
                onClick={handleCopyUrl}
                title="Copy URL"
                className="p-1 hover:text-cyan-500 transition-colors shrink-0"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              {copied && <span className="text-[10px] text-emerald-500 font-sans">Copied!</span>}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 rounded-lg transition-colors"
              >
                {uploading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="w-3.5 h-3.5" />
                )}
                <span>Replace Image</span>
              </button>

              <button
                type="button"
                disabled={uploading}
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Drag-and-Drop Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`cursor-pointer rounded-xl border-2 border-dashed p-6 transition-all duration-200 flex flex-col items-center justify-center text-center ${
            isDragging
              ? "border-cyan-500 bg-cyan-500/10 scale-[1.01]"
              : "border-slate-300 dark:border-navy-700 bg-slate-50/70 dark:bg-navy-950/60 hover:bg-slate-100 dark:hover:bg-navy-900 hover:border-cyan-500/50"
          }`}
        >
          {uploading ? (
            <div className="py-2 flex flex-col items-center gap-2">
              <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Uploading image to server...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-11 h-11 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-navy-950 dark:text-white">
                  Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  PNG, JPG, WebP, SVG or GIF (Max 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Helper text */}
      {helperText && <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>}

      {/* Error Message */}
      {error && (
        <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

// Named alias so either import { ImageUploader } or import { ImageUpload } works
export { ImageUploader, ImageUploader as ImageUpload };
