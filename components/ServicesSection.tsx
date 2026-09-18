"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Cpu,
  LineChart,
  Camera,
  CloudSun,
  Network,
  Users,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Flame,
  Shield,
  Radio,
  Layers,
  LayoutGrid,
  Maximize2,
  ShieldCheck,
  Activity,
  Check,
  Search,
  Gauge,
  Droplets,
  Server,
  Cable,
  Waves,
  Wrench,
  FileCheck2,
} from "lucide-react";
import { Service } from "@/models";

interface ServicesSectionProps {
  services?: Service[];
}

export interface GranularService {
  id: string;
  verticalId: "satellite" | "security" | "hydrology" | "network" | "metering" | "amc";
  verticalTitle: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  keyFeatures: string[];
  standards: string;
  applications: string[];
}

// Complete 18-Service Catalog from Company Profile PDF Pages 5 & 6 + AMC from Pages 2 & 3
export const FULL_SERVICES_CATALOG: GranularService[] = [
  // 1. Satellite & Telemetry
  {
    id: "vsat-services",
    verticalId: "satellite",
    verticalTitle: "Satellite & Telemetry",
    title: "V-SAT Services",
    subtitle: "Satellite-Based Communication Solutions",
    description: "High-reliability satellite communication terminals designed for extreme offshore platforms, remote river basins, and un-networked industrial locations.",
    icon: Radio,
    keyFeatures: ["High-throughput satellite uplinks", "Deepwater offshore & remote deployment", "Ku/Ka-band stabilized transceivers", "24/7 dedicated link budget monitoring"],
    standards: "ISRO / INSAT & Global Satcom",
    applications: ["Offshore Oil Basins", "Remote Weather Telemetry", "Disaster Command Centers"],
  },
  {
    id: "scada-data-transfer",
    verticalId: "satellite",
    verticalTitle: "Satellite & Telemetry",
    title: "SCADA Data Transfer",
    subtitle: "Central & Remote Station Data Transmission",
    description: "Fail-safe telemetry bridges streaming real-time supervisory data from distributed plant PLCs, offshore rigs, and pipelines to central control rooms.",
    icon: Cpu,
    keyFeatures: ["Modbus RTU/TCP, Profinet & OPC-UA", "Sub-second failover telemetry", "Encrypted point-to-point tunneling", "Redundant telemetry routing"],
    standards: "IEC 60870-5-104 / DNP3",
    applications: ["Refinery Pipelines", "Electrical Substations", "Water Distribution Grids"],
  },
  {
    id: "epabx-microwave",
    verticalId: "satellite",
    verticalTitle: "Satellite & Telemetry",
    title: "EPABX/PBX & Microwave Links",
    subtitle: "Enterprise Communication Solutions",
    description: "Turnkey supply, tower alignment, and commissioning of enterprise voice PBX systems and high-capacity wireless microwave transmission links.",
    icon: Radio,
    keyFeatures: ["Point-to-point microwave RF alignment", "Hybrid IP-PBX telephony architectures", "Extreme line-of-sight range coverage", "Clear voice & data duplex channels"],
    standards: "DoT / TEC Standards",
    applications: ["Carrier Cellular Towers", "Corporate Industrial Campuses", "Mining Sites"],
  },
  {
    id: "p2p-pml-equipment",
    verticalId: "satellite",
    verticalTitle: "Satellite & Telemetry",
    title: "P2P / PML Equipment",
    subtitle: "Point-to-Point & Point-to-Multipoint Wireless",
    description: "Ruggedized unlicensed and licensed wireless radios enabling long-range broadband links between disparate industrial facilities.",
    icon: Network,
    keyFeatures: ["P2P & P2MP long-range wireless backbones", "Carrier-grade throughput & low jitter", "Weatherproof IP67 rated outdoor units", "Adaptive frequency modulation"],
    standards: "IEEE 802.11ay / Microwave Specs",
    applications: ["Plant Security Perimeters", "Remote Substation Uplinks", "Smart City Nodes"],
  },

  // 2. Security & Surveillance
  {
    id: "cctv-surveillance",
    verticalId: "security",
    verticalTitle: "Security & Surveillance",
    title: "CCTV Surveillance",
    subtitle: "Hazardous-Zone & Video Monitoring Systems",
    description: "End-to-end design, civil cabling, installation, and multi-tier monitoring for high-security facilities, explosion-proof plants, and statewide police networks.",
    icon: Camera,
    keyFeatures: ["PESO flameproof & explosion-proof cameras", "Centralized Video Management Systems (VMS)", "Statewide multi-zone network rollouts", "AI perimeter breach analytics"],
    standards: "PESO / OISD / ATEX Zone 1 & 2",
    applications: ["Refineries & Gas Plants", "232+ State Police Stations", "Container Depots & Ports"],
  },
  {
    id: "fire-alarm-systems",
    verticalId: "security",
    verticalTitle: "Security & Surveillance",
    title: "Fire Alarm Systems",
    subtitle: "Industrial Detection & Alert Systems",
    description: "Integrated addressable and conventional fire detection, smoke aspiration, flame sensors, and automated emergency alarm sirens.",
    icon: Flame,
    keyFeatures: ["Addressable optical & thermal detectors", "Integration with plant SCADA & suppression", "Multi-zone central fire alarm panels", "Audio-visual evacuation strobes"],
    standards: "NFPA 72 / BIS 2189",
    applications: ["Control Rooms & Data Centers", "Chemical Warehouses", "Commercial Complexes"],
  },
  {
    id: "automated-boom-barriers",
    verticalId: "security",
    verticalTitle: "Security & Surveillance",
    title: "Automated Boom Barriers & Access Control",
    subtitle: "Secure Facility Access Management",
    description: "Heavy-duty automatic boom barriers, RFID long-range vehicle tags, biometric access control turnstiles, and automated toll systems.",
    icon: Shield,
    keyFeatures: ["High-speed brushless DC motor barriers", "RFID UHF vehicle reader integration", "Anti-crash safety loop detectors", "Centralized access logging & audit"],
    standards: "IP54 / CE Certified Mechanisms",
    applications: ["Logistics Parks & CONCOR Depots", "Industrial Plant Gates", "Corporate Tech Parks"],
  },

  // 3. Hydrometrology & Environmental
  {
    id: "automatic-weather-stations",
    verticalId: "hydrology",
    verticalTitle: "Hydrometrology",
    title: "Automatic Weather Stations (AWS)",
    subtitle: "Real-Time Weather Monitoring",
    description: "Autonomous solar-powered weather telemetry stations measuring rainfall, air temperature, relative humidity, wind velocity, and solar radiation.",
    icon: CloudSun,
    keyFeatures: ["Autonomous solar panel & battery backup", "Ultrasonic wind & tipping bucket rain gauges", "INSAT / 4G cellular telemetry options", "Satellite Earth Receiving Station (ERS) link"],
    standards: "WMO / CWC Telemetry Specs",
    applications: ["Central Water Commission (CWC)", "River Basin Authorities", "Disaster Response Units"],
  },
  {
    id: "water-level-recorders",
    verticalId: "hydrology",
    verticalTitle: "Hydrometrology",
    title: "Automatic Water Level Recorders (AWLR)",
    subtitle: "Water Level Monitoring & Flood Telemetry",
    description: "Non-contact radar and hydrostatic pressure water level transmitters logging reservoir levels, canal discharge, and river flood telemetry in real-time.",
    icon: Waves,
    keyFeatures: ["High-accuracy millimeter-wave radar", "Submersible stainless steel pressure sensors", "Automated flood warning alert triggers", "Continuous remote data display"],
    standards: "CWC / ISO 4373 Hydrometry",
    applications: ["Dam & Reservoir Monitoring", "River Basin Hydrology", "Irrigation Canal Networks"],
  },

  // 4. Network & IT Infrastructure
  {
    id: "wireless-networks",
    verticalId: "network",
    verticalTitle: "Network & IT Infrastructure",
    title: "Wireless Networks",
    subtitle: "Industrial Design, Implementation & Management",
    description: "Enterprise Wi-Fi 6/6E coverage and private wireless networking designed for high-density warehouses, outdoor process yards, and executive campuses.",
    icon: Radio,
    keyFeatures: ["High-density industrial access points", "RF propagation mapping & heatmaps", "Seamless client roaming & QoS", "Enterprise WPA3 security protocols"],
    standards: "Wi-Fi 6 / 802.11ax Standards",
    applications: ["Manufacturing Floors", "Campuses & Universities", "Airport Cargo Terminals"],
  },
  {
    id: "lan-switches",
    verticalId: "network",
    verticalTitle: "Network & IT Infrastructure",
    title: "LAN Switches & Routing",
    subtitle: "Installation & Configuration",
    description: "Deployment and hardening of Layer-2 and Layer-3 industrial switches, VLAN segregation, link aggregation, and high-availability core routing.",
    icon: Server,
    keyFeatures: ["Managed Layer-2/3 switching & PoE+", "Redundant ring topologies (ERPS / RSTP)", "Hardened wide-temperature DIN-rail switches", "VLAN segregation for SCADA & CCTV"],
    standards: "IEEE 802.3 / TIA-568",
    applications: ["Substation Control Rooms", "Plant Edge Networks", "Corporate LANs"],
  },
  {
    id: "structured-cabling",
    verticalId: "network",
    verticalTitle: "Network & IT Infrastructure",
    title: "Structured Cabling",
    subtitle: "Professional Enterprise Cabling Solutions",
    description: "End-to-end design and installation of Cat-6/Cat-6A copper structured cabling, patch panels, server rack management, and Fluke certified testing.",
    icon: Cable,
    keyFeatures: ["Fluke DSX certified link budgets", "Neat cable management & labeling", "High-density patch panel termination", "Zero-crosstalk twisted pair standards"],
    standards: "ANSI/TIA-568-D / ISO 11801",
    applications: ["Corporate Data Centers", "Administrative Head Offices", "Industrial Control Centers"],
  },
  {
    id: "ofc-network",
    verticalId: "network",
    verticalTitle: "Network & IT Infrastructure",
    title: "OFC Network Establishment",
    subtitle: "Fiber Optic Backbone & Splicing",
    description: "Turnkey laying of armored Single-Mode/Multi-Mode Optical Fiber Cables (OFC), trenching, precision fusion splicing, OTDR testing, and ring formation.",
    icon: Activity,
    keyFeatures: ["Armored direct-buried & aerial OFC laying", "Precision core-alignment fusion splicing", "OTDR trace certification & loss budgets", "Ring redundancy for uninterrupted uptime"],
    standards: "ITU-T G.652D / TIA-455",
    applications: ["Telecom Carrier Backhauls", "Inter-building Campus Links", "Railways Signalling"],
  },
  {
    id: "ups-products",
    verticalId: "network",
    verticalTitle: "Network & IT Infrastructure",
    title: "UPS Products & Power Systems",
    subtitle: "Uninterruptible Power Supply Systems",
    description: "Industrial-grade online double-conversion UPS systems, battery bank racks, static transfer switches, and continuous clean power protection.",
    icon: Zap,
    keyFeatures: ["True online double-conversion topology", "Extended battery runtime configurations", "SNMP remote power telemetry cards", "Surge and transient voltage suppression"],
    standards: "IEC 62040 / ISO 9001",
    applications: ["SCADA Server Racks", "CCTV Video Recording Rooms", "Continuous Process Lines"],
  },

  // 5. Metering & Monitoring Services
  {
    id: "energy-meters",
    verticalId: "metering",
    verticalTitle: "Metering & Monitoring",
    title: "Energy Meter Installation & Data Display",
    subtitle: "Smart Energy Monitoring Telemetry",
    description: "Multi-function digital energy meters, sub-metering grids, power quality analysis, and real-time dashboard display for energy optimization.",
    icon: Gauge,
    keyFeatures: ["Class 0.2s / 0.5s high-accuracy meters", "RS485 Modbus telemetry connectivity", "Harmonics, voltage, and power factor logs", "Real-time LED & web dashboard display"],
    standards: "IS 14697 / IEC 62053",
    applications: ["Commercial Utility Grids", "Factory Production Floors", "Green Energy Parks"],
  },
  {
    id: "flow-meters",
    verticalId: "metering",
    verticalTitle: "Metering & Monitoring",
    title: "Flow Meter Installation & Data Display",
    subtitle: "Precise Flow Measurement & Monitoring",
    description: "Electromagnetic, ultrasonic, and turbine flow meters calibrated for water, hydrocarbons, and chemicals with digital totalizers and remote telemetry.",
    icon: Droplets,
    keyFeatures: ["Electromagnetic & ultrasonic sensors", "Bypass piping & in-line flanged mounting", "Digital flow rate & cumulative totalizers", "4-20mA & pulse output to SCADA"],
    standards: "OIML R49 / ISO 4064",
    applications: ["Water Treatment Plants", "Chemical Batch Processing", "Petroleum Transfer Lines"],
  },

  // 6. Annual Maintenance Contract (AMC) Services (PDF Page 2 & 3)
  {
    id: "comprehensive-amc",
    verticalId: "amc",
    verticalTitle: "Turnkey AMC Services",
    title: "Comprehensive AMC Services",
    subtitle: "Full-Risk Equipment & Parts Coverage",
    description: "All-inclusive Annual Maintenance Contracts covering routine preventive inspections, emergency breakdown repair, spare parts replacement, and committed SLA response times.",
    icon: Wrench,
    keyFeatures: ["100% spare parts & component coverage", "Guaranteed 4-hour emergency response SLA", "Quarterly scheduled preventive servicing", "Dedicated resident engineer deployment"],
    standards: "ISO 9001:2015 Quality SLA",
    applications: ["Statewide CCTV Surveillance", "SCADA Plant Infrastructure", "Critical Satcom Links"],
  },
  {
    id: "non-comprehensive-amc",
    verticalId: "amc",
    verticalTitle: "Turnkey AMC Services",
    title: "Non-Comprehensive AMC Services",
    subtitle: "Routine Engineering & On-Call Maintenance",
    description: "Cost-effective annual maintenance contracts providing scheduled engineering audits, sensor recalibration, system health checks, and rapid on-call technician dispatch.",
    icon: FileCheck2,
    keyFeatures: ["Scheduled periodic system health audits", "Sensor calibration & optical cleaning", "Discounted spare parts procurement", "Priority technical helpdesk access"],
    standards: "Standard Industrial SLA",
    applications: ["Weather Stations (AWS)", "Campus IT LAN Infrastructure", "Access Control Barriers"],
  },
];

const VERTICALS = [
  { id: "all", label: "All Services (18)" },
  { id: "satellite", label: "Satellite & Telemetry" },
  { id: "security", label: "Security & CCTV" },
  { id: "hydrology", label: "Hydrometrology (AWS)" },
  { id: "network", label: "IT & OFC Network" },
  { id: "metering", label: "Energy & Flow Meters" },
  { id: "amc", label: "Turnkey AMC Services" },
];

export default function ServicesSection({ services = [] }: ServicesSectionProps) {
  const [viewMode, setViewMode] = useState<"spotlight" | "grid">("spotlight");
  const [activeVertical, setActiveVertical] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>(FULL_SERVICES_CATALOG[0].id);

  // Merge DB services with FULL_SERVICES_CATALOG so admin changes take immediate effect
  const mergedCatalog = useMemo(() => {
    if (!services || services.length === 0) {
      return FULL_SERVICES_CATALOG;
    }

    // Map existing catalog items, overriding with DB values if matched
    const processedCatalog = FULL_SERVICES_CATALOG.map((catItem) => {
      const dbMatch = services.find(
        (dbItem) =>
          dbItem.slug === catItem.id ||
          dbItem.title.toLowerCase().includes(catItem.title.toLowerCase().slice(0, 10)) ||
          catItem.title.toLowerCase().includes(dbItem.title.toLowerCase().slice(0, 10))
      );

      if (dbMatch) {
        if (!dbMatch.isActive) return null; // Deactivated in admin
        return {
          ...catItem,
          title: dbMatch.title || catItem.title,
          subtitle: dbMatch.tagline || catItem.subtitle,
          description: dbMatch.description || dbMatch.shortDescription || catItem.description,
          keyFeatures:
            dbMatch.capabilities && dbMatch.capabilities.length > 0
              ? dbMatch.capabilities
              : catItem.keyFeatures,
          applications:
            dbMatch.targetIndustries && dbMatch.targetIndustries.length > 0
              ? dbMatch.targetIndustries
              : catItem.applications,
        };
      }
      return catItem;
    }).filter(Boolean) as GranularService[];

    // Add any completely new services added by the admin that don't match the standard catalog
    const newDbServices = services.filter((dbItem) => {
      if (!dbItem.isActive) return false;
      const alreadyIncluded = processedCatalog.some(
        (p) =>
          p.id === dbItem.slug ||
          p.title.toLowerCase().includes(dbItem.title.toLowerCase().slice(0, 10)) ||
          dbItem.title.toLowerCase().includes(p.title.toLowerCase().slice(0, 10))
      );
      return !alreadyIncluded;
    });

    const additionalItems: GranularService[] = newDbServices.map((dbItem) => ({
      id: dbItem.slug || `service-${dbItem.sortOrder}`,
      verticalId: "network",
      verticalTitle: "Turnkey Services",
      title: dbItem.title,
      subtitle: dbItem.tagline || "Engineered Solutions",
      description: dbItem.description || dbItem.shortDescription || "",
      icon: Cpu,
      keyFeatures: dbItem.capabilities || [],
      standards: "Enterprise Grade",
      applications: dbItem.targetIndustries || [],
    }));

    return [...processedCatalog, ...additionalItems];
  }, [services]);

  // Dynamic Verticals with real count
  const verticalOptions = useMemo(() => {
    return [
      { id: "all", label: `All Services (${mergedCatalog.length})` },
      { id: "satellite", label: "Satellite & Telemetry" },
      { id: "security", label: "Security & CCTV" },
      { id: "hydrology", label: "Hydrometrology (AWS)" },
      { id: "network", label: "IT & OFC Network" },
      { id: "metering", label: "Energy & Flow Meters" },
      { id: "amc", label: "Turnkey AMC Services" },
    ];
  }, [mergedCatalog.length]);

  // Filter services by active vertical and search query
  const filteredServices = useMemo(() => {
    return mergedCatalog.filter((s) => {
      const matchesVertical = activeVertical === "all" || s.verticalId === activeVertical;
      const matchesSearch =
        searchQuery === "" ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.keyFeatures.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesVertical && matchesSearch;
    });
  }, [mergedCatalog, activeVertical, searchQuery]);

  const activeService =
    filteredServices.find((s) => s.id === selectedServiceId) ||
    filteredServices[0] ||
    mergedCatalog[0] ||
    FULL_SERVICES_CATALOG[0];

  const ActiveIcon = activeService.icon;

  return (
    <section id="services" className="py-24 bg-slate-50 dark:bg-navy-950 border-b border-slate-200 dark:border-navy-800/80 transition-colors relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/5 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
            <span>Our Services &amp; Specialized Solutions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-navy-950 dark:text-white tracking-tight">
            Integrated Systems for Critical Operations
          </h2>

          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed">
            From V-SAT satellite telemetry and explosion-proof CCTV to solar Automatic Weather Stations,
            metering, and Comprehensive AMC contracts, CSD Enterprises delivers turnkey engineering.
          </p>

          {/* Search Bar & View Mode Toggle */}
          <div className="mt-8 w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-navy-800">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search 18 services (e.g. AWS, AMC, OFC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-white dark:bg-navy-900 p-1 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("spotlight")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all btn-press ${
                  viewMode === "spotlight"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Deep-Dive Focus</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all btn-press ${
                  viewMode === "grid"
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View ({mergedCatalog.length})</span>
              </button>
            </div>
          </div>

          {/* Vertical Category Filter Pills */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {verticalOptions.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveVertical(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all btn-press ${
                  activeVertical === cat.id
                    ? "bg-navy-950 text-white dark:bg-red-600 shadow-sm shadow-red-600/25 font-bold"
                    : "bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-navy-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ----------------- MODE 1: INTERACTIVE SPOTLIGHT DEEP-DIVE ----------------- */}
        {viewMode === "spotlight" && (
          <div>
            {/* Horizontal Service Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar justify-start lg:justify-center">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                const isActive = service.id === activeService.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedServiceId(service.id)}
                    type="button"
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 shrink-0 border ${
                      isActive
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-600 shadow-lg shadow-red-600/25 scale-[1.02]"
                        : "bg-white dark:bg-navy-900/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-navy-800 hover:border-red-500/40 hover:bg-slate-50 dark:hover:bg-navy-800"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-red-500 dark:text-red-400"}`} />
                    <span>{service.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Service Showcase Card */}
            <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-navy-800 shadow-xl relative overflow-hidden bg-white/80 dark:bg-navy-900/70 backdrop-blur-md">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Details */}
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold uppercase bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                        {activeService.verticalTitle}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-red-500" />
                        {activeService.standards}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-black text-navy-950 dark:text-white mb-1">
                      {activeService.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-3">
                      {activeService.subtitle}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {activeService.description}
                    </p>
                  </div>

                  {/* Key Features List */}
                  <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-navy-950/70 border border-slate-200 dark:border-navy-800">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy-950 dark:text-white flex items-center gap-1.5 mb-3">
                      <Check className="w-4 h-4 text-red-600 dark:text-red-500" />
                      <span>Key Engineering Scope &amp; Specifications</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                      {activeService.keyFeatures.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-red-600 dark:text-red-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typical Applications */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Primary Client Deployments:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeService.applications.map((app, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Direct CTAs */}
                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href="#contact"
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/25 transition-all btn-press flex items-center gap-2"
                    >
                      <span>Request RFQ for {activeService.title}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href="tel:7678561876"
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-navy-800 dark:hover:bg-navy-700 border border-slate-200 dark:border-navy-700 transition-all"
                    >
                      Call Desk: +91 7678561876
                    </a>
                  </div>
                </div>

                {/* Right Column: High-Tech Graphic Card */}
                <div className="lg:col-span-5 flex flex-col justify-center items-center">
                  <div className="w-full p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-navy-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden text-center">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 shadow-inner">
                      <ActiveIcon className="w-10 h-10" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-widest block mb-1">
                      CSD ENTERPRISES ENGINEERING
                    </span>
                    <h4 className="text-xl font-bold text-white mb-2">
                      {activeService.title}
                    </h4>
                    <p className="text-xs text-slate-300 mb-6">
                      {activeService.subtitle}
                    </p>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Standard Compliance:</span>
                        <strong className="text-white">{activeService.standards}</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>Turnkey Execution:</span>
                        <strong className="text-emerald-400">Supply, Design &amp; Install</strong>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span>AMC Option:</span>
                        <strong className="text-red-400">Comprehensive / Non-Comp</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ----------------- MODE 2: COMPLETE 18-SERVICE MATRIX ----------------- */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="p-6 rounded-2xl glass-panel border border-slate-200 dark:border-navy-800 bg-white/90 dark:bg-navy-900/70 shadow-sm hover:shadow-xl hover:border-red-500/40 transition-all duration-300 card-hover flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-700">
                        {service.verticalTitle}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-navy-950 dark:text-white mb-1">
                      {service.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-red-600 dark:text-red-400 uppercase tracking-wider mb-2">
                      {service.subtitle}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 mb-4">
                      {service.keyFeatures.slice(0, 3).map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-red-500 shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-navy-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-medium text-slate-400">
                      {service.standards}
                    </span>
                    <a
                      href="#contact"
                      className="font-bold text-red-600 dark:text-red-400 hover:underline flex items-center gap-1"
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
