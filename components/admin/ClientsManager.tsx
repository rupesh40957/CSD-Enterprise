"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, Save, X, Building, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Client } from "@/models";
import ImageUploader from "./ImageUploader";

export default function ClientsManager() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editing, setEditing] = useState<Client | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/clients");
      if (res.ok) {
        const data = await res.json();
        setClients(data.clients || []);
      }
    } catch {
      setFeedback({ type: "error", message: "Failed to load clients." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleOpenNew = () => {
    setEditing({
      name: "",
      logo: "/logo/csd-logo.png",
      website: "",
      sortOrder: clients.length,
      isActive: true,
      featured: true,
    });
    setIsNew(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;

    try {
      const method = isNew ? "POST" : "PUT";
      const res = await fetch("/api/clients", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", message: `Client ${isNew ? "added" : "updated"} successfully!` });
        setEditing(null);
        fetchClients();
      } else {
        setFeedback({ type: "error", message: data.error || "Save failed." });
      }
    } catch {
      setFeedback({ type: "error", message: "Network error while saving." });
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id || !confirm("Are you sure you want to delete this client?")) return;

    try {
      const res = await fetch(`/api/clients?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedback({ type: "success", message: "Client deleted successfully." });
        fetchClients();
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
            Client &amp; Partner Ecosystem
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage partner logos, corporate websites, and marquee rotation items.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchClients}
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
            <span>Add Client</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in ${
            feedback.type === "success"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clients.map((client) => (
          <div
            key={client._id ? String(client._id) : client.name}
            className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 shadow-sm flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-navy-800 p-1 flex items-center justify-center text-cyan-500 shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-navy-950 dark:text-white line-clamp-1">
                  {client.name}
                </h4>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Order #{client.sortOrder} • {client.isActive ? "Active" : "Disabled"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setEditing(client);
                  setIsNew(false);
                }}
                className="p-2 rounded-lg bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 hover:text-cyan-500"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(client._id ? String(client._id) : undefined)}
                className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-cyan-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setEditing(null)}
              type="button"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-950 dark:text-white mb-4">
              {isNew ? "Add Client / Partner" : "Edit Client"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client / Partner Name *
                </label>
                <input
                  type="text"
                  required
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <ImageUploader
                label="Partner / Client Logo"
                value={editing.logo}
                onChange={(url) => setEditing({ ...editing, logo: url })}
                required
                helperText="Upload transparent PNG or SVG logo file"
                previewHeight="h-24"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Official Website URL
                </label>
                <input
                  type="text"
                  value={editing.website || ""}
                  onChange={(e) => setEditing({ ...editing, website: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={editing.sortOrder}
                    onChange={(e) => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl text-sm bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 dark:text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={editing.isActive}
                      onChange={(e) => setEditing({ ...editing, isActive: e.target.checked })}
                      className="rounded text-cyan-500"
                    />
                    <span>Active in Marquee</span>
                  </label>
                </div>
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
                  <span>Save Client</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
