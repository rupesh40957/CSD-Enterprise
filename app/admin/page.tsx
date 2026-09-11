"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar, { AdminTab } from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import OverviewStats from "@/components/admin/OverviewStats";
import InquiryTable from "@/components/admin/InquiryTable";
import InquiryDetails from "@/components/admin/InquiryDetails";
import SubscribersTable from "@/components/admin/SubscribersTable";
import ProjectsManager from "@/components/admin/ProjectsManager";
import DatabaseHealth from "@/components/admin/DatabaseHealth";
import SectionsManager from "@/components/admin/SectionsManager";
import HeroSlidesManager from "@/components/admin/HeroSlidesManager";
import WebsiteSettingsManager from "@/components/admin/WebsiteSettingsManager";
import ServicesManager from "@/components/admin/ServicesManager";
import IndustriesManager from "@/components/admin/IndustriesManager";
import ClientsManager from "@/components/admin/ClientsManager";
import CertificationsManager from "@/components/admin/CertificationsManager";
import TestimonialsManager from "@/components/admin/TestimonialsManager";
import BlogManager from "@/components/admin/BlogManager";
import FaqManager from "@/components/admin/FaqManager";
import StatsManager from "@/components/admin/StatsManager";
import CtaManager from "@/components/admin/CtaManager";
import NavigationManager from "@/components/admin/NavigationManager";
import MediaManager from "@/components/admin/MediaManager";
import { Inquiry, InquiryStatus } from "@/models/Inquiry";
import { Subscriber } from "@/models/Subscriber";
import { Project } from "@/models/Project";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  // Stats
  const [counts, setCounts] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    contactedInquiries: 0,
    inReviewInquiries: 0,
    completedInquiries: 0,
    subscribers: 0,
    projects: 0,
  });

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiriesTotal, setInquiriesTotal] = useState(0);
  const [inquiriesPage, setInquiriesPage] = useState(1);
  const [inquiriesTotalPages, setInquiriesTotalPages] = useState(1);
  const [inquiriesSearch, setInquiriesSearch] = useState("");
  const [inquiriesStatusFilter, setInquiriesStatusFilter] = useState("All");
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  // Subscribers State
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(false);
  const [subscribersSearch, setSubscribersSearch] = useState("");

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Check Database Health
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setDbConnected(data.database === "connected");
    } catch {
      setDbConnected(false);
    }
  }, []);

  // Fetch Inquiries
  const fetchInquiries = useCallback(async () => {
    setInquiriesLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(inquiriesPage),
        limit: "10",
      });
      if (inquiriesSearch) params.set("search", inquiriesSearch);
      if (inquiriesStatusFilter !== "All") params.set("status", inquiriesStatusFilter);

      const res = await fetch(`/api/inquiries?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries || []);
        setInquiriesTotal(data.pagination?.total || 0);
        setInquiriesTotalPages(data.pagination?.totalPages || 1);

        if (data.counts) {
          setCounts((prev) => ({
            ...prev,
            totalInquiries: data.counts.all,
            newInquiries: data.counts.new,
            contactedInquiries: data.counts.contacted,
            inReviewInquiries: data.counts.inReview,
            completedInquiries: data.counts.completed,
          }));
        }
      }
    } catch {
      // Inquiries error handled
    } finally {
      setInquiriesLoading(false);
    }
  }, [inquiriesPage, inquiriesSearch, inquiriesStatusFilter, router]);

  // Fetch Subscribers
  const fetchSubscribers = useCallback(async () => {
    setSubscribersLoading(true);
    try {
      const params = new URLSearchParams();
      if (subscribersSearch) params.set("search", subscribersSearch);

      const res = await fetch(`/api/newsletter?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.subscribers || []);
        setCounts((prev) => ({ ...prev, subscribers: data.total || 0 }));
      }
    } catch {
      // Subscribers error handled
    } finally {
      setSubscribersLoading(false);
    }
  }, [subscribersSearch]);

  // Fetch Projects
  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
        setCounts((prev) => ({ ...prev, projects: data.total || 0 }));
      }
    } catch {
      // Projects error handled
    } finally {
      setProjectsLoading(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    checkHealth();
    fetchInquiries();
    fetchSubscribers();
    fetchProjects();
  }, [checkHealth, fetchInquiries, fetchSubscribers, fetchProjects]);

  // Inquiry Status Change
  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        fetchInquiries();
        if (selectedInquiry && String(selectedInquiry._id) === id) {
          setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } catch {
      alert("Failed to update status.");
    }
  };

  // Inquiry Delete
  const handleDeleteInquiry = async (id: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchInquiries();
      }
    } catch {
      alert("Failed to delete inquiry.");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case "overview":
        return "Executive Operations Dashboard";
      case "inquiries":
        return "B2B Leads & Technical Inquiries";
      case "subscribers":
        return "Technical Bulletin Subscribers";
      case "projects":
        return "Enterprise Project Portfolio";
      case "health":
        return "Database & Architecture Health";
      case "sections":
        return "Home Page Section Order & Visibility";
      case "hero":
        return "Hero Carousel Slide Manager";
      case "settings":
        return "Website Settings & Brand Configuration";
      case "services":
        return "Services & Engineering Verticals";
      case "industries":
        return "Industries & Sector Solutions";
      case "clients":
        return "Client & Partner Ecosystem";
      case "certifications":
        return "Quality & Compliance Certifications";
      case "testimonials":
        return "Client Testimonials & Reviews";
      case "blog":
        return "Technical Bulletins & Articles";
      case "faqs":
        return "Frequently Asked Questions";
      case "stats":
        return "Company KPI Statistics";
      case "cta":
        return "Consultation CTA Banner";
      case "media":
        return "Media Library & Assets";
      case "navigation":
        return "Header Navigation Menu";
      default:
        return "Admin Portal";
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-navy-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Fixed Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        inquiryCount={counts.newInquiries}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminHeader
          title={getTabTitle()}
          dbConnected={dbConnected}
          onOpenMobileMenu={() => setMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewStats
              counts={counts}
              recentInquiries={inquiries}
              dbConnected={dbConnected}
              onSelectTab={setActiveTab}
              onViewInquiry={setSelectedInquiry}
            />
          )}

          {activeTab === "inquiries" && (
            <InquiryTable
              inquiries={inquiries}
              loading={inquiriesLoading}
              total={inquiriesTotal}
              page={inquiriesPage}
              totalPages={inquiriesTotalPages}
              search={inquiriesSearch}
              setSearch={setInquiriesSearch}
              statusFilter={inquiriesStatusFilter}
              setStatusFilter={setInquiriesStatusFilter}
              onPageChange={setInquiriesPage}
              onViewInquiry={setSelectedInquiry}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteInquiry}
            />
          )}

          {activeTab === "subscribers" && (
            <SubscribersTable
              subscribers={subscribers}
              loading={subscribersLoading}
              total={counts.subscribers}
              search={subscribersSearch}
              setSearch={setSubscribersSearch}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsManager
              projects={projects}
              loading={projectsLoading}
              onRefresh={fetchProjects}
            />
          )}

          {activeTab === "sections" && <SectionsManager />}
          {activeTab === "hero" && <HeroSlidesManager />}
          {activeTab === "settings" && <WebsiteSettingsManager />}
          {activeTab === "services" && <ServicesManager />}
          {activeTab === "industries" && <IndustriesManager />}
          {activeTab === "clients" && <ClientsManager />}
          {activeTab === "certifications" && <CertificationsManager />}
          {activeTab === "testimonials" && <TestimonialsManager />}
          {activeTab === "blog" && <BlogManager />}
          {activeTab === "faqs" && <FaqManager />}
          {activeTab === "stats" && <StatsManager />}
          {activeTab === "cta" && <CtaManager />}
          {activeTab === "media" && <MediaManager />}
          {activeTab === "navigation" && <NavigationManager />}

          {activeTab === "health" && (
            <DatabaseHealth
              dbConnected={dbConnected}
              counts={counts}
              onRefresh={() => {
                checkHealth();
                fetchInquiries();
                fetchSubscribers();
                fetchProjects();
              }}
            />
          )}
        </main>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <InquiryDetails
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteInquiry}
        />
      )}
    </div>
  );
}
