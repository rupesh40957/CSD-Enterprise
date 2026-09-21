"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  X,
  FileImage,
  Link as LinkIcon,
  UploadCloud,
} from "lucide-react";
import ImageUploader from "./ImageUploader";

interface MediaItem {
  _id?: string;
  url: string;
  filename: string;
  alt: string;
  type: string;
  sizeBytes: number;
  createdAt: string;
}

export default function MediaManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newFilename, setNewFilename] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [adding, setAdding] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      if (res.ok) {
        const data = await res.json();
        setMedia(data.media || []);
      }
    } catch {
      showToast("error", "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this media record?")) return;
    try {
      const res = await fetch(`/api/media?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("success", "Media deleted");
        fetchMedia();
      }
    } catch {
      showToast("error", "Delete failed");
    }
  };

  const handleAdd = async () => {
    if (!newUrl || !newFilename) return;
    setAdding(true);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: newUrl,
          filename: newFilename,
          alt: newAlt || newFilename,
          type: "image",
          sizeBytes: 0,
        }),
      });
      if (res.ok) {
        showToast("success", "Media record added!");
        setNewUrl("");
        setNewFilename("");
        setNewAlt("");
        setShowAddForm(false);
        fetchMedia();
      } else {
        const err = await res.json();
        showToast("error", err.error || "Add failed");
      }
    } catch {
      showToast("error", "Network error");
    } finally {
      setAdding(false);
    }
  };

  const filtered = media.filter(
    (m) =>
      !search ||
      m.filename.toLowerCase().includes(search.toLowerCase()) ||
      m.alt.toLowerCase().includes(search.toLowerCase()) ||
      m.url.toLowerCase().includes(search.toLowerCase())
  );

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "—";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-cyan-500" />
            Media Library
          </h2>
          <p className="text-sm text-slate-500 mt-1">{media.length} file{media.length !== 1 ? "s" : ""} registered</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 flex items-center gap-2 shadow-sm"
        >
          <Upload className="w-4 h-4" /> Register Media URL
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Register External / Static Media URL</h3>
            <button onClick={() => setShowAddForm(false)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-navy-800">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">URL *</label>
              <input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="/images/photo.jpg or https://..."
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Filename *</label>
              <input
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="photo.jpg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Alt Text</label>
              <input
                value={newAlt}
                onChange={(e) => setNewAlt(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
                placeholder="Description of the image"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleAdd} disabled={adding || !newUrl || !newFilename} className="px-5 py-2 text-sm font-semibold rounded-xl bg-cyan-500 text-white hover:bg-cyan-600 disabled:opacity-50 flex items-center gap-2">
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              Register
            </button>
          </div>
        </div>
      )}

      {/* Direct Device Upload Dropzone */}
      <div className="bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 p-6 space-y-3">
        <h3 className="text-sm font-bold text-navy-950 dark:text-white flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-cyan-500" />
          Direct File Upload from Device
        </h3>
        <ImageUploader
          value=""
          onChange={(url) => {
            if (url) {
              showToast("success", "File uploaded and registered to media library!");
              fetchMedia();
            }
          }}
          helperText="Upload any JPG, PNG, WebP, SVG or GIF image from your device. In production, files are securely stored on Vercel Blob and indexed here immediately."
        />
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search media..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-sm focus:ring-2 focus:ring-cyan-500 outline-none"
        />
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <FileImage className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">No media files found</p>
          <p className="text-xs mt-1">Register media URLs to use across the CMS</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-800 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image Preview */}
              <div className="relative aspect-video bg-slate-100 dark:bg-navy-950 flex items-center justify-center">
                {item.url.match(/\.(jpg|jpeg|png|gif|svg|webp)/i) ? (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <FileImage className="w-12 h-12 text-slate-300 dark:text-navy-600" />
                )}
              </div>

              {/* Info */}
              <div className="p-4 space-y-2">
                <p className="text-sm font-semibold truncate">{item.filename}</p>
                <p className="text-xs text-slate-400 truncate">{item.url}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{item.type}</span>
                  <span>•</span>
                  <span>{formatBytes(item.sizeBytes)}</span>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-navy-800">
                  <button
                    onClick={() => handleCopy(item.url)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-lg flex items-center justify-center gap-1 transition-colors ${
                      copied === item.url
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                        : "bg-slate-50 dark:bg-navy-950 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-800"
                    }`}
                  >
                    {copied === item.url ? <CheckCircle2 className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied === item.url ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => item._id && handleDelete(item._id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-slate-400 hover:text-rose-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
