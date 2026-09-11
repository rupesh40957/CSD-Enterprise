
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Save, X, FileText, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { BlogPost } from "@/models";
import ImageUploader from "./ImageUploader";
import { formatDate } from "@/lib/utils";

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [tagsStr, setTagsStr] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load posts." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenNew = () => {
    setEditing({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "/images/automation-hero.jpg",
      author: "CSD Engineering Desk",
      authorRole: "Technical Systems Architect",
      category: "Industrial Automation",
      tags: [],
      readTime: "4 min read",
      publishedAt: new Date(),
      featured: true,
      isPublished: true,
    });
    setTagsStr("");
    setIsNew(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditing(post);
    setTagsStr((post.tags || []).join(", "));
    setIsNew(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      ...editing,
      tags,
    };

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/blog", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: `Article ${isNew ? "published" : "updated"} successfully!` });
        setEditing(null);
        fetchPosts();
      } else {
        setFeedback({ type: "error", message: data.error || "Save failed." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error while saving." });
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await fetch(`/api/blog?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedback({ type: "success", message: "Article deleted successfully." });
        fetchPosts();
      } else {
        setFeedback({ type: "error", message: "Delete failed." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error during delete." });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-navy-950 dark:text-white">
            Technical Bulletins &amp; Articles
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Publish engineering whitepapers, SCADA safety articles, and company insights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchPosts}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-navy-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-navy-950 bg-cyan-400 hover:bg-cyan-300 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in ${feedback.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-400"
            }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.slug || String(post._id)}
            className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-navy-950">
                <Image
                  src={post.coverImage || "/images/industrial-facility.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover opacity-85"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-navy-900/90 text-cyan-400">
                  {post.category}
                </div>
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-navy-900/90 text-slate-300">
                  {post.isPublished ? "Published" : "Draft"}
                </div>
              </div>

              <h3 className="font-extrabold text-base text-navy-950 dark:text-white line-clamp-2">
                {post.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="text-[11px] text-slate-400">
                By {post.author} • {formatDate(post.publishedAt)}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-navy-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{post.readTime || "5 min"}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(post)}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post._id ? String(post._id) : undefined)}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditing(null)}
              type="button"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-4">
              {isNew ? "Write Technical Article" : "Edit Article"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category *
                  </label>
                  <input
                    type="text"
                    required
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={editing.readTime || ""}
                    onChange={(e) => setEditing({ ...editing, readTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Summary / Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editing.excerpt}
                  onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Article Body *
                </label>
                <textarea
                  rows={6}
                  required
                  value={editing.content}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />
              </div>

              <ImageUploader
                label="Article Cover Image"
                value={editing.coverImage}
                onChange={(url) => setEditing({ ...editing, coverImage: url })}
                required
                helperText="Upload feature photograph or illustration for the bulletin (e.g. 1200x630)"
                aspectRatio="banner"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (Comma-separated)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.isPublished}
                    onChange={(e) => setEditing({ ...editing, isPublished: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  <span>Publish Immediately</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={editing.featured}
                    onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                    className="rounded text-cyan-500"
                  />
                  <span>Feature on Home Page</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-navy-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-navy-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Article</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
