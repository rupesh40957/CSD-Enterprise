"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  MailCheck,
  FolderGit2,
  Activity,
  LogOut,
  ExternalLink,
  Layers,
  Sparkles,
  Settings,
  Cpu,
  Factory,
  Building,
  Award,
  MessageSquare,
  FileText,
  HelpCircle,
  BarChart3,
  Megaphone,
  Image as ImageIcon,
  Navigation2,
  X,
  Info,
} from "lucide-react";

export type AdminTab =
  | "overview"
  | "sections"
  | "hero"
  | "about"
  | "settings"
  | "navigation"
  | "services"
  | "industries"
  | "projects"
  | "clients"
  | "certifications"
  | "testimonials"
  | "blog"
  | "faqs"
  | "stats"
  | "cta"
  | "media"
  | "inquiries"
  | "subscribers"
  | "health";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  inquiryCount?: number;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  inquiryCount = 0,
  mobileOpen = false,
  setMobileOpen,
  onLogout,
}: AdminSidebarProps) {
  const cmsNavGroups = [
    {
      group: "Core & Leads",
      items: [
        { id: "overview" as AdminTab, label: "Overview", icon: LayoutDashboard },
        { id: "inquiries" as AdminTab, label: "Leads & RFQs", icon: Inbox, badge: inquiryCount },
        { id: "subscribers" as AdminTab, label: "Subscribers", icon: MailCheck },
      ],
    },
    {
      group: "Home Page Structure",
      items: [
        { id: "sections" as AdminTab, label: "Page Sections Order", icon: Layers },
        { id: "hero" as AdminTab, label: "Hero Carousel Slides", icon: Sparkles },
        { id: "about" as AdminTab, label: "About Us & Ethos", icon: Info },
        { id: "stats" as AdminTab, label: "Company KPI Stats", icon: BarChart3 },
        { id: "cta" as AdminTab, label: "Consultation CTA", icon: Megaphone },
      ],
    },
    {
      group: "Content & Business",
      items: [
        { id: "services" as AdminTab, label: "Services & Verticals", icon: Cpu },
        { id: "industries" as AdminTab, label: "Industries & Sectors", icon: Factory },
        { id: "projects" as AdminTab, label: "Projects Portfolio", icon: FolderGit2 },
        { id: "clients" as AdminTab, label: "Clients & Partners", icon: Building },
        { id: "certifications" as AdminTab, label: "Certifications", icon: Award },
        { id: "testimonials" as AdminTab, label: "Testimonials", icon: MessageSquare },
        { id: "blog" as AdminTab, label: "Bulletins & Articles", icon: FileText },
        { id: "faqs" as AdminTab, label: "FAQs", icon: HelpCircle },
      ],
    },
    {
      group: "Configuration",
      items: [
        { id: "settings" as AdminTab, label: "Website Settings & Logo", icon: Settings },
        { id: "navigation" as AdminTab, label: "Navigation Menu", icon: Navigation2 },
        { id: "media" as AdminTab, label: "Media Library", icon: ImageIcon },
        { id: "health" as AdminTab, label: "Database Health", icon: Activity },
      ],
    },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen && setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white dark:bg-navy-950 border-r border-slate-200 dark:border-navy-800 transition-transform duration-300 flex flex-col justify-between p-4 overflow-y-auto ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div>
          {/* Top Logo & Title */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-navy-900 p-1 border border-slate-200 dark:border-red-500/30 shadow-sm shadow-red-500/10 flex items-center justify-center">
                <Image
                  src="/logo/csd-logo.svg"
                  alt="CSD Enterprises Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-navy-950 dark:text-white flex items-center gap-1">
                  CSD <span className="text-red-600 dark:text-red-500">Admin</span>
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  CMS Control Center
                </span>
              </div>
            </div>

            {setMobileOpen && (
              <button
                onClick={() => setMobileOpen(false)}
                className="lg:hidden p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Grouped Navigation Links */}
          <nav className="mt-4 space-y-4">
            {cmsNavGroups.map((group) => (
              <div key={group.group}>
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  {group.group}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? "bg-navy-950 text-white dark:bg-cyan-500 dark:text-navy-950 shadow-sm"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-navy-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400 dark:text-navy-950" : "text-slate-400"}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white dark:bg-navy-950 dark:text-cyan-400"
                                : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-200 dark:border-navy-800 space-y-2 mt-6">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-500 hover:bg-slate-50 dark:hover:bg-navy-900 rounded-lg transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Website</span>
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-navy-800">Public</span>
          </Link>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
