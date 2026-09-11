"use client";

import React from "react";
import {
  HomeSection,
  HeroSlide,
  Statistic,
  AboutContent,
  Service,
  Industry,
  Project,
  Client,
  Certification,
  Testimonial,
  BlogPost,
  Faq,
  CtaContent,
  WebsiteSettings,
} from "@/models";

import Hero from "./Hero";
import StatsSection from "./StatsSection";
import AboutBento from "./AboutBento";
import ServicesSection from "./ServicesSection";
import IndustriesSection from "./IndustriesSection";
import ProjectsShowcase from "./ProjectsShowcase";
import ClientsSection from "./ClientsSection";
import CertificationsSection from "./CertificationsSection";
import TestimonialsSection from "./TestimonialsSection";
import PanIndiaPresence from "./PanIndiaPresence";
import BlogSection from "./BlogSection";
import FaqSection from "./FaqSection";
import CtaSection from "./CtaSection";
import ContactSection from "./ContactSection";

export interface DynamicHomeData {
  settings?: WebsiteSettings | null;
  sections?: HomeSection[];
  heroSlides?: HeroSlide[];
  statistics?: Statistic[];
  aboutContent?: AboutContent | null;
  services?: Service[];
  industries?: Industry[];
  projects?: Project[];
  clients?: Client[];
  certifications?: Certification[];
  testimonials?: Testimonial[];
  blogPosts?: BlogPost[];
  faqs?: Faq[];
  ctaContent?: CtaContent | null;
}

interface DynamicSectionRendererProps {
  data: DynamicHomeData;
}

const DEFAULT_SECTIONS_ORDER: HomeSection[] = [
  { sectionType: "hero", title: "Hero", sortOrder: 0, isActive: true },
  { sectionType: "stats", title: "Stats", sortOrder: 1, isActive: true },
  { sectionType: "about", title: "About", sortOrder: 2, isActive: true },
  { sectionType: "services", title: "Services", sortOrder: 3, isActive: true },
  { sectionType: "industries", title: "Industries", sortOrder: 4, isActive: true },
  { sectionType: "projects", title: "Projects", sortOrder: 5, isActive: true },
  { sectionType: "clients", title: "Clients", sortOrder: 6, isActive: true },
  { sectionType: "certifications", title: "Certifications", sortOrder: 7, isActive: true },
  { sectionType: "testimonials", title: "Testimonials", sortOrder: 8, isActive: true },
  { sectionType: "presence", title: "Presence", sortOrder: 9, isActive: true },
  { sectionType: "blog", title: "Blog", sortOrder: 10, isActive: true },
  { sectionType: "faq", title: "FAQ", sortOrder: 11, isActive: true },
  { sectionType: "cta", title: "CTA", sortOrder: 12, isActive: true },
  { sectionType: "contact", title: "Contact", sortOrder: 13, isActive: true },
];

export default function DynamicSectionRenderer({ data }: DynamicSectionRendererProps) {
  const orderedSections =
    data.sections && data.sections.length > 0
      ? [...data.sections].sort((a, b) => a.sortOrder - b.sortOrder)
      : DEFAULT_SECTIONS_ORDER;

  return (
    <>
      {orderedSections.map((sec) => {
        if (!sec.isActive) return null;

        switch (sec.sectionType) {
          case "hero":
            return <Hero key="hero" slides={data.heroSlides} />;

          case "stats":
            return <StatsSection key="stats" statistics={data.statistics} />;

          case "about":
            return <AboutBento key="about" about={data.aboutContent} />;

          case "services":
            return <ServicesSection key="services" services={data.services} />;

          case "industries":
            return <IndustriesSection key="industries" industries={data.industries} />;

          case "projects":
            return <ProjectsShowcase key="projects" projects={data.projects} />;

          case "clients":
            return <ClientsSection key="clients" clients={data.clients} />;

          case "certifications":
            return <CertificationsSection key="certifications" certifications={data.certifications} />;

          case "testimonials":
            return <TestimonialsSection key="testimonials" testimonials={data.testimonials} />;

          case "presence":
            return <PanIndiaPresence key="presence" />;

          case "blog":
            return <BlogSection key="blog" blogPosts={data.blogPosts} />;

          case "faq":
            return <FaqSection key="faq" faqs={data.faqs} />;

          case "cta":
            return <CtaSection key="cta" cta={data.ctaContent} />;

          case "contact":
            return <ContactSection key="contact" />;

          default:
            return null;
        }
      })}
    </>
  );
}
