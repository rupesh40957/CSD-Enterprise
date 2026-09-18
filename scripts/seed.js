require('dotenv').config();
require('dotenv').config({ path: '.env.local', override: true });
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in environment variables (.env / .env.local)');
  process.exit(1);
}

const WEBSITE_SETTINGS = {
  companyName: "CSD Enterprises",
  tagline: "Vision of Connectivity",
  logo: "/logo/csd-logo.png",
  favicon: "/logo/csd-favicon.png",
  phone: "+91 7678561876",
  altPhone: "+91 8355976842 / 9022248869",
  email: "support@csdenterprises.in",
  address: "OM Plaza Commercial Complex, 60, 1st Floor, Nalasopara West, Mumbai, Maharashtra - 401203",
  workingHours: "Mon – Sat: 9:00 AM – 7:00 PM (24/7 On-Call Support)",
  googleMapsUrl: "https://maps.google.com/?q=Nalasopara+West+Mumbai",
  facebook: "https://www.facebook.com/profile.php?id=100007821287704",
  twitter: "https://www.x.com/@Shambhu86728236",
  linkedin: "https://www.linkedin.com/company/csd-enterprises",
  youtube: "",
  whatsapp: "917678561876",
  defaultSeoTitle: "CSD Enterprises | Vision of Connectivity | Industrial Automation, Telemetry & AMC",
  defaultSeoDescription: "System integrator formed in 2019 delivering SCADA, Hydrometrology AWS, V-SAT satcom, CCTV surveillance, and Comprehensive AMC across India.",
  defaultSeoImage: "/logo/csd-logo.png",
  copyrightText: "Copyright © 2019–2026 CSD Enterprises. All Rights Reserved.",
  privacyPolicyUrl: "/privacy",
  termsUrl: "/terms",
  updatedAt: new Date(),
};

const NAVIGATION_ITEMS = [
  { label: "Home", href: "#hero", sortOrder: 0, isActive: true },
  { label: "About", href: "#about", sortOrder: 1, isActive: true },
  { label: "Services", href: "#services", sortOrder: 2, isActive: true },
  { label: "Industries", href: "#industries", sortOrder: 3, isActive: true },
  { label: "Projects", href: "#projects", sortOrder: 4, isActive: true },
  { label: "Clients", href: "#clients", sortOrder: 5, isActive: true },
  { label: "Presence", href: "#presence", sortOrder: 6, isActive: true },
  { label: "Contact", href: "#contact", sortOrder: 7, isActive: true },
];

const HOME_SECTIONS = [
  { sectionType: "hero", title: "Hero Banner", sortOrder: 0, isActive: true },
  { sectionType: "stats", title: "Key Performance Indicators", sortOrder: 1, isActive: true },
  { sectionType: "about", title: "Company Background & Ethos", sortOrder: 2, isActive: true },
  { sectionType: "services", title: "Core Competencies & Verticals", sortOrder: 3, isActive: true },
  { sectionType: "industries", title: "Target Industries & Solutions", sortOrder: 4, isActive: true },
  { sectionType: "projects", title: "Featured Landmark Projects", sortOrder: 5, isActive: true },
  { sectionType: "clients", title: "Client & Partner Ecosystem", sortOrder: 6, isActive: true },
  { sectionType: "certifications", title: "Quality & Compliance Certifications", sortOrder: 7, isActive: true },
  { sectionType: "testimonials", title: "Client Recommendations", sortOrder: 8, isActive: true },
  { sectionType: "presence", title: "Pan-India Geographic Footprint", sortOrder: 9, isActive: true },
  { sectionType: "blog", title: "Technical Bulletins & News", sortOrder: 10, isActive: true },
  { sectionType: "faq", title: "Frequently Asked Questions", sortOrder: 11, isActive: true },
  { sectionType: "cta", title: "Call to Action Consultation", sortOrder: 12, isActive: true },
  { sectionType: "contact", title: "Request for Proposal & Inquiries", sortOrder: 13, isActive: true },
];

const HERO_SLIDES = [
  {
    badge: "Active across 9+ States | Mission-Critical 24/7",
    heading: "Empowering Industries with",
    highlightedText: "Advanced Automation & IT Infrastructure.",
    description:
      "Delivering exceptional PLC/SCADA, CCTV Surveillance, and Satcom solutions for offshore and onshore enterprise clients since 2019. Trusted by India's premier energy, telecommunications, and defense organizations.",
    primaryCtaText: "Explore Our Solutions",
    primaryCtaUrl: "#services",
    secondaryCtaText: "View Prestigious Projects",
    secondaryCtaUrl: "#projects",
    image: "/images/automation-hero.jpg",
    systemUptime: "99.98% System Uptime",
    telemetryItems: [
      { label: "Flameproof SCADA & PLC", value: "Active" },
      { label: "Explosion-Proof CCTV", value: "Verified" },
      { label: "Solar AWS Hydrometrology", value: "Transmitting" },
      { label: "Offshore TSAT Links", value: "Online" },
    ],
    sortOrder: 0,
    isActive: true,
  },
  {
    badge: "Offshore Mumbai High | Satcom Telemetry",
    heading: "Mission-Critical Telemetry &",
    highlightedText: "Deepwater Offshore Communications.",
    description:
      "Pioneering high-availability satellite telemetry, remote SCADA connectivity, and ruggedized explosion-proof surveillance in deepwater basins and hazardous hydrocarbon storage facilities.",
    primaryCtaText: "Review Offshore Scope",
    primaryCtaUrl: "#projects",
    secondaryCtaText: "Request Technical RFP",
    secondaryCtaUrl: "#contact",
    image: "/images/industrial-facility.jpg",
    systemUptime: "Zero Failover Latency",
    telemetryItems: [
      { label: "Deepwater TSAT Transceiver", value: "Locked" },
      { label: "Marine SCADA Uplink", value: "12ms Latency" },
      { label: "Remote Platform Telemetry", value: "Active" },
      { label: "Solar Telemetry Node", value: "Sync" },
    ],
    sortOrder: 1,
    isActive: true,
  },
];

const STATISTICS = [
  { label: "States Covered", value: "9", suffix: "+", sublabel: "Offshore & Onshore", icon: "MapPin", sortOrder: 0, isActive: true },
  { label: "Projects Deployed", value: "100", suffix: "+", sublabel: "Turnkey & Commissioned", icon: "CheckCircle2", sortOrder: 1, isActive: true },
  { label: "Police Stations Secured", value: "232", suffix: "+", sublabel: "Statewide Multi-Zone CCTV", icon: "ShieldCheck", sortOrder: 2, isActive: true },
  { label: "Mission-Critical SLA", value: "24/7", suffix: "", sublabel: "Technical Operations", icon: "Activity", sortOrder: 3, isActive: true },
  { label: "Offshore Node Uptime", value: "99.98", suffix: "%", sublabel: "Telemetry & Satcom", icon: "Cpu", sortOrder: 4, isActive: true },
];

const ABOUT_CONTENT = {
  badge: "Company Profile & Ethos",
  heading: "Vision of Connectivity — Established 2019",
  description:
    "We CSD Enterprises are a premier system integrator formed in 2019, dedicated to delivering exceptional products and services to our clients offshore and onshore with a team of qualified and innovative professionals.",
  visionTitle: "Primary Objectives & Vision",
  visionDescription:
    "To provide connectivity with various media, essential SCADA Data, and Hydrometrology data to reputed firms, organizations, and institutions; provide advanced telecom solutions in the efficient application of Information Technology; and deliver turnkey supply, design, installation, and Comprehensive & Non-Comprehensive AMC services.",
  experienceBadge: "Established 2019",
  statsOffshore: "Offshore",
  statsOffshoreSub: "Deepwater Satcom & SCADA",
  statsOnshore: "Onshore",
  statsOnshoreSub: "Power, Oil, Gas & Police",
  coreValues: [
    {
      icon: "Award",
      title: "Commitment to Excellence",
      description:
        "Upholding rigorous engineering standards, certified installations, and zero-defect execution in high-stakes environments.",
      highlight: "Excellence First",
      color: "from-red-500/20 to-rose-500/20 text-red-500",
    },
    {
      icon: "Target",
      title: "Customer-Centric Approach",
      description:
        "Designing tailored automation, satcom, and telemetry architectures that adapt specifically to client workflows.",
      highlight: "Tailored Architecture",
      color: "from-blue-500/20 to-cyan-500/20 text-blue-500",
    },
    {
      icon: "HeartHandshake",
      title: "Customer Satisfaction",
      description:
        "Exceeding expectations through continuous improvement, rapid on-site resolution, and long-term client relationships.",
      highlight: "SLA Satisfaction",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500",
    },
    {
      icon: "Users",
      title: "Teamwork",
      description:
        "Collaborative synergy between senior technical architects, offshore specialists, and on-ground field technicians.",
      highlight: "Unified Engineering",
      color: "from-purple-500/20 to-indigo-500/20 text-purple-500",
    },
    {
      icon: "Shield",
      title: "Professionalism",
      description:
        "Strict industrial safety compliance, transparent reporting, and adherence to PESO, OISD, and ISO guidelines.",
      highlight: "Certified Standards",
      color: "from-amber-500/20 to-orange-500/20 text-amber-500",
    },
    {
      icon: "RefreshCw",
      title: "Flexibility & Adaptability",
      description:
        "Agile engineering execution across challenging terrains, offshore platforms, and multi-state distributed locations.",
      highlight: "Agile Field Response",
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-500",
    },
    {
      icon: "Scale",
      title: "Accountability",
      description:
        "Complete turnkey responsibility from initial site survey and design through to commissioning and AMC lifecycles.",
      highlight: "Full Lifecycle Ownership",
      color: "from-rose-500/20 to-pink-500/20 text-rose-500",
    },
    {
      icon: "Compass",
      title: "Social Responsibility",
      description:
        "Empowering national critical infrastructure, public safety networks, and transparent governance systems.",
      highlight: "Nation Building",
      color: "from-indigo-500/20 to-blue-500/20 text-indigo-500",
    },
    {
      icon: "Leaf",
      title: "Environment Responsibility",
      description:
        "Deploying solar-powered Automatic Weather Stations, energy-efficient telemetry, and sustainable green installations.",
      highlight: "Green Telemetry",
      color: "from-green-500/20 to-emerald-500/20 text-green-500",
    },
  ],
  updatedAt: new Date(),
};

const SERVICES = [
  {
    title: "Industrial Automation",
    slug: "industrial-automation",
    number: "01",
    tagline: "High-Reliability PLC / DCS & SCADA Engineering",
    shortDescription: "End-to-end supply, programming, and commissioning of fault-tolerant PLC, DCS, and supervisory SCADA systems tailored for high-availability process plants.",
    description: "End-to-end supply, programming, and commissioning of fault-tolerant Programmable Logic Controllers (PLC), Distributed Control Systems (DCS), and supervisory SCADA systems tailored for high-availability process plants.",
    icon: "Cpu",
    image: "/images/automation-hero.jpg",
    targetIndustries: [
      "Power Generation Plants",
      "Steel & Alumina Smelters",
      "Solar Mega Power Plants",
      "Oil & Gas Refineries",
      "Pharmaceutical Process Lines",
      "Chemical Processing Units",
      "Automotive Assembly Plants",
    ],
    capabilities: [
      "PLC / DCS Architecture & Logic Programming",
      "Redundant SCADA Visualization & HMI Stations",
      "Hazardous Area Field Instrumentation",
      "Real-time Alarm & Fail-Safe Interlock Systems",
      "Batch Processing & Recipe Execution",
    ],
    featured: true,
    sortOrder: 0,
    isActive: true,
  },
  {
    title: "Digitization & IoT",
    slug: "digitization-iot",
    number: "02",
    tagline: "Industry 4.0 Telemetry & Operational Intelligence",
    shortDescription: "Adoption and seamless integration of digital technologies across industrial production floors. Turning disparate machine controllers into connected telemetry pipelines.",
    description: "Adoption and seamless integration of digital technologies across industrial production floors. Turning disparate machine controllers into connected, actionable telemetry pipelines.",
    icon: "LineChart",
    image: "/images/automation-hero.jpg",
    targetIndustries: [
      "Heavy Manufacturing",
      "Renewable Energy Parks",
      "Continuous Process Plants",
      "Food & Beverage",
      "Supply Chain Hubs",
    ],
    capabilities: [
      "Industrial IoT & Machine Tool Connectivity",
      "Asset Management & Automated Audit Trails",
      "Overall Equipment Efficiency (OEE) Monitoring",
      "Energy Management Systems (EMS)",
      "Automated Compliance & Production Reporting",
    ],
    featured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    title: "CCTV Surveillance",
    slug: "cctv-surveillance",
    number: "03",
    tagline: "Hazardous-Zone & Statewide Surveillance Architectures",
    shortDescription: "Design, civil cabling, installation, and multi-tier monitoring for high-security facilities, explosion-proof plants, and statewide police networks.",
    description: "Design, civil cabling, installation, and multi-tier monitoring for high-security facilities. Proven deployment track record spanning explosion-proof hydrocarbon storage plants to statewide police networks.",
    icon: "Camera",
    image: "/images/industrial-facility.jpg",
    targetIndustries: [
      "Petrochemical & Gas Depots",
      "State Police & Law Enforcement",
      "Critical Infrastructure & Utilities",
      "Seaports & Maritime Depots",
      "Mining & Smelting Sites",
    ],
    capabilities: [
      "Explosion-Proof & Flameproof Certified Cameras",
      "Central Video Management Systems (VMS)",
      "Statewide Multi-Station Distributed Deployment",
      "Intelligent Video Analytics & Perimeter Breach",
      "Redundant Network Video Recording (NVR)",
    ],
    featured: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    title: "Sensorization & Hydrometrology",
    slug: "sensorization-hydrometrology",
    number: "04",
    tagline: "Autonomous Solar-Powered Weather & Water Telemetry",
    shortDescription: "Turnkey deployment of Automatic Weather Stations (AWS) and hydrological monitoring telemetry engineered for extreme remote locations with satellite uplink.",
    description: "Turnkey deployment of Automatic Weather Stations (AWS) and hydrological monitoring telemetry. Engineered for autonomous operation in extreme remote locations with satellite uplink.",
    icon: "CloudSun",
    image: "/images/automation-hero.jpg",
    targetIndustries: [
      "Water Resource Commissions",
      "Disaster Management Authorities",
      "Agricultural Forecast Agencies",
      "River Basin Administrations",
      "Offshore Marine Research",
    ],
    capabilities: [
      "Solar-Powered Autonomous AWS Stations",
      "Atmospheric Sensors: Temp, Humidity, Rain, Wind",
      "Satellite & Cellular Telemetry Gateways",
      "Satellite Earth Receiving Stations (ERS)",
      "Real-time Hydrological Flood Alert Modeling",
    ],
    featured: true,
    sortOrder: 3,
    isActive: true,
  },
  {
    title: "IT Network & Infrastructure",
    slug: "it-network-infrastructure",
    number: "05",
    tagline: "Ruggedized Enterprise LAN, OFC & Power Systems",
    shortDescription: "Industrial-grade structured cabling, optical fiber cable backbones, managed switching, enterprise routing, fire detection integration, and online UPS.",
    description: "Industrial-grade structured cabling, optical fiber cable (OFC) backbones, managed switching, enterprise routing, fire detection integration, and uninterrupted power supply (UPS) solutions.",
    icon: "Network",
    image: "/images/network-cabling.jpg",
    targetIndustries: [
      "Telecom Carrier Backhauls",
      "Data Centers & Control Rooms",
      "Industrial Campuses & Plants",
      "Corporate Headquarters",
      "Offshore Platforms",
    ],
    capabilities: [
      "Optical Fiber Cable (OFC) Network Establishment",
      "Enterprise LAN, Core Switches & Secure Routers",
      "High-Density Structured Cabling Solutions",
      "Integrated Fire Alarm & Suppression Systems",
      "Industrial-Grade Online UPS Systems",
    ],
    featured: true,
    sortOrder: 4,
    isActive: true,
  },
  {
    title: "Manpower Facility Services",
    slug: "manpower-facility-services",
    number: "06",
    tagline: "Certified Technical Engineering Staffing",
    shortDescription: "Skilled instrumentation technicians, network engineers, and plant maintenance teams contributing to industrial productivity nationwide.",
    description: "Dedicated, certified engineering and operations manpower contributing to India's industrial growth. Providing skilled instrumentation technicians, network engineers, and plant maintenance teams.",
    icon: "Users",
    image: "/images/industrial-facility.jpg",
    targetIndustries: [
      "Offshore Drilling & Platforms",
      "Power Distribution Utilities",
      "Refineries & Chemical Plants",
      "Facility Management Hubs",
      "Smart City Operations",
    ],
    capabilities: [
      "Offshore & Onshore Instrumentation Engineers",
      "OFC Splicing & Telecom Commissioning Teams",
      "SCADA & PLC Maintenance Engineers",
      "24/7 Facility Infrastructure Operations Staff",
      "Turnkey Field Engineering Deployment",
    ],
    featured: true,
    sortOrder: 5,
    isActive: true,
  },
];

const INDUSTRIES = [
  {
    title: "Oil & Gas Refineries",
    slug: "oil-gas-refineries",
    description: "Hazardous-area certified instrumentation, flameproof CCTV surveillance, and offshore deepwater telemetry systems compliant with PESO and OISD standards.",
    image: "/images/industrial-facility.jpg",
    icon: "Flame",
    featured: true,
    sortOrder: 0,
    isActive: true,
  },
  {
    title: "State Law Enforcement & Public Safety",
    slug: "law-enforcement-safety",
    description: "Large-scale distributed surveillance networks across 232+ police stations featuring centralized video management and redundant cloud/local storage.",
    image: "/images/industrial-facility.jpg",
    icon: "Shield",
    featured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    title: "Telecom & Fiber Backhauls",
    slug: "telecom-fiber-backhauls",
    description: "Statewide FTTH networks, microwave tower radio alignment, high-capacity OFC splicing, and 24/7 telecom network operations center support.",
    image: "/images/network-cabling.jpg",
    icon: "Radio",
    featured: true,
    sortOrder: 2,
    isActive: true,
  },
  {
    title: "Water Resources & Flood Telemetry",
    slug: "water-resources-hydrology",
    description: "Satellite Earth Receiving Stations (ERS) and autonomous Automatic Weather Stations (AWS) transmitting river basin and hydrological data in real-time.",
    image: "/images/automation-hero.jpg",
    icon: "CloudSun",
    featured: true,
    sortOrder: 3,
    isActive: true,
  },
  {
    title: "Power Generation & Utilities",
    slug: "power-generation-utilities",
    description: "Distributed Control Systems (DCS), boiler control logic, substation automation, and high-voltage switchyard instrumentation for thermal & solar plants.",
    image: "/images/automation-hero.jpg",
    icon: "Zap",
    featured: true,
    sortOrder: 4,
    isActive: true,
  },
  {
    title: "Process & Chemical Manufacturing",
    slug: "process-chemical-manufacturing",
    description: "Batch recipe automation, safety interlocks, hazardous environment sensors, and plant-wide SCADA visualizations maximizing uptime and compliance.",
    image: "/images/industrial-facility.jpg",
    icon: "Cpu",
    featured: true,
    sortOrder: 5,
    isActive: true,
  },
];

const PROJECTS = [
  {
    title: "Explosion-Proof CCTV & Intranet Connectivity",
    slug: "explosion-proof-cctv-intranet-iocl",
    client: "Indian Oil Corporation Limited (IOCL)",
    location: "IOCL Gas Plant & Marketing Section",
    category: "CCTV & Surveillance",
    shortDescription: "Turnkey hazardous-area certified wiring, explosion-proof cameras, and intranet connectivity deployment in IOCL gas plant.",
    description:
      "Turnkey installation, hazardous-area certified wiring, and commissioning of explosion-proof CCTV surveillance and intranet connectivity in the IOCL Marketing Section & Gas Plant.",
    scope: "Explosion-proof enclosures, flameproof PTZ/fixed cameras, fiber-optic backbone, and control room visualization.",
    image: "/images/industrial-facility.jpg",
    featured: true,
    active: true,
    sortOrder: 0,
    createdAt: new Date("2021-03-15"),
    updatedAt: new Date("2021-03-15"),
  },
  {
    title: "FTTH Infrastructure & Microwave Antenna Deployment",
    slug: "ftth-infrastructure-microwave-jio",
    client: "Reliance JIO Infocomm",
    location: "Statewide Bihar Circle",
    category: "IT & Telecom",
    shortDescription: "Large-scale FTTH network establishment and critical Sector-4 microwave antenna replacement and RF alignment.",
    description:
      "Large-scale Fiber-to-the-Home (FTTH) network establishment and critical Sector-4 microwave antenna replacement and RF alignment across Bihar state.",
    scope: "Optical fiber distribution, microwave transmitter alignment, link budget validation, and high-speed network testing.",
    image: "/images/network-cabling.jpg",
    featured: true,
    active: true,
    sortOrder: 1,
    createdAt: new Date("2022-01-20"),
    updatedAt: new Date("2022-01-20"),
  },
  {
    title: "Offshore TSAT Communication Link at Mumbai High",
    slug: "offshore-tsat-communication-mumbai-high-lt",
    client: "Larsen & Toubro (L&T)",
    location: "Mumbai High Offshore Basin",
    category: "Offshore Satcom",
    shortDescription: "Robust TSAT satellite communication links on offshore oil & gas extraction platforms in Mumbai High for mission-critical SCADA.",
    description:
      "Establishment of robust TSAT satellite communication links on offshore oil & gas extraction platforms in Mumbai High for mission-critical SCADA telemetry.",
    scope: "Satellite transceivers, offshore platform telemetry integration, marine-grade cabling, and round-the-clock remote link monitoring.",
    image: "/images/automation-hero.jpg",
    featured: true,
    active: true,
    sortOrder: 2,
    createdAt: new Date("2022-08-10"),
    updatedAt: new Date("2022-08-10"),
  },
  {
    title: "Statewide CCTV Surveillance across 232 Police Stations",
    slug: "statewide-cctv-surveillance-chhattisgarh-police",
    client: "Chhattisgarh State Police Department",
    location: "232 Police Stations, Chhattisgarh",
    category: "CCTV & Surveillance",
    shortDescription: "Comprehensive multi-zone CCTV surveillance system installation and commissioning across 232 police stations with centralized VMS.",
    description:
      "Comprehensive multi-zone CCTV surveillance system installation and commissioning across 232 police stations with centralized video management.",
    scope: "232 locations, high-definition IP camera networks, localized NVR storage, power backup, and operator training.",
    image: "/images/industrial-facility.jpg",
    featured: true,
    active: true,
    sortOrder: 3,
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-04-05"),
  },
  {
    title: "Satellite Earth Receiving Station (ERS)",
    slug: "satellite-earth-receiving-station-cwc-delhi",
    client: "Central Water Commission (CWC Delhi)",
    location: "CWC Telemetry Hub, New Delhi",
    category: "Hydrometrology",
    shortDescription: "Satellite Earth Receiving Station deployment for real-time reception of hydrometrology data via satellite telemetry for flood and weather monitoring.",
    description:
      "Satellite Earth Receiving Station (ERS) deployment for real-time reception of hydrometrology data via satellite telemetry for flood and weather monitoring.",
    scope: "Earth station dish configuration, automated weather sensor integration, telemetry reception servers, and analytics pipeline.",
    image: "/images/automation-hero.jpg",
    featured: true,
    active: true,
    sortOrder: 4,
    createdAt: new Date("2023-11-12"),
    updatedAt: new Date("2023-11-12"),
  },
];

const CLIENTS = [
  { name: "Central Water Commission (CWC)", logo: "/images/clients/cwc.png", website: "https://cwc.gov.in", sortOrder: 0, isActive: true, featured: true },
  { name: "Oil and Natural Gas Corporation Limited (ONGC)", logo: "/images/clients/ongc.svg", website: "https://ongcindia.com", sortOrder: 1, isActive: true, featured: true },
  { name: "Indian Oil Corporation Limited (IOCL)", logo: "/images/clients/iocl.svg", website: "https://iocl.com", sortOrder: 2, isActive: true, featured: true },
  { name: "CONCOR Air Limited", logo: "/images/clients/concor.svg", website: "https://concorindia.co.in", sortOrder: 3, isActive: true, featured: true },
  { name: "Food Corporation of India (FCI)", logo: "/images/clients/fci.svg", website: "https://fci.gov.in", sortOrder: 4, isActive: true, featured: true },
  { name: "Indian Institute of Management, Indore (IIM Indore)", logo: "/images/clients/iim-indore.svg", website: "https://iimidr.ac.in", sortOrder: 5, isActive: true, featured: true },
  { name: "Hindustan Petroleum Corporation Limited (HPCL)", logo: "/images/clients/hpcl.svg", website: "https://hindustanpetroleum.com", sortOrder: 6, isActive: true, featured: true },
  { name: "Life Insurance Corporation of India (LIC)", logo: "/images/clients/lic.svg", website: "https://licindia.in", sortOrder: 7, isActive: true, featured: true },
  { name: "L&T Electrical & Automation", logo: "/images/clients/lnt.svg", website: "https://larsentoubro.com", sortOrder: 8, isActive: true, featured: true },
  { name: "Indian Railways", logo: "/images/clients/indian-railways.svg", website: "https://indianrailways.gov.in", sortOrder: 9, isActive: true, featured: true },
  { name: "National Fertilizer Limited (NFL)", logo: "/images/clients/nfl.svg", website: "https://nationalfertilizers.com", sortOrder: 10, isActive: true, featured: true },
  { name: "Adani Group", logo: "/images/clients/adani.svg", website: "https://adani.com", sortOrder: 11, isActive: true, featured: true },
  { name: "Bharat Sanchar Nigam Limited (BSNL)", logo: "/images/clients/bsnl.png", website: "https://bsnl.co.in", sortOrder: 12, isActive: true, featured: true },
];

const CERTIFICATIONS = [
  {
    name: "ISO 9001:2015",
    issuer: "International Organization for Standardization",
    description: "Certified Quality Management System for engineering supply, industrial automation, and turnkey systems integration.",
    logo: "/logo/csd-logo.png",
    sortOrder: 0,
    isActive: true,
  },
  {
    name: "PESO Flameproof Certified",
    issuer: "Petroleum and Explosives Safety Organization",
    description: "Certified for electrical wiring, enclosures, and instrumentation in Zone-1 and Zone-2 hazardous chemical and hydrocarbon environments.",
    logo: "/logo/csd-logo.png",
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "MSME Registered Enterprise",
    issuer: "Ministry of Micro, Small and Medium Enterprises",
    description: "Recognized Government of India engineering contractor and technology integration enterprise.",
    logo: "/logo/csd-logo.png",
    sortOrder: 2,
    isActive: true,
  },
  {
    name: "OISD Compliance Verification",
    issuer: "Oil Industry Safety Directorate",
    description: "Adherence to safety standards for fire protection, instrumentation, and CCTV in oil and gas refineries.",
    logo: "/logo/csd-logo.png",
    sortOrder: 3,
    isActive: true,
  },
];

const TESTIMONIALS = [
  {
    name: "A. K. Srivastava",
    designation: "Chief Engineering Manager",
    company: "Indian Oil Corporation Ltd (IOCL)",
    content: "CSD Enterprises executed our hazardous-area CCTV and plant intranet connectivity with exceptional engineering discipline. Their compliance with flameproof standards and rapid execution was exemplary.",
    rating: 5,
    projectReference: "IOCL Gas Plant Turnkey Surveillance",
    featured: true,
    sortOrder: 0,
    isActive: true,
  },
  {
    name: "Rameshwar Patel",
    designation: "General Manager (Telecom Projects)",
    company: "Reliance JIO Infocomm",
    content: "Deploying FTTH infrastructure across tough terrains required agile field teams and precise optical fiber testing. CSD Enterprises surpassed link quality KPIs and completed handovers well within schedule.",
    rating: 5,
    projectReference: "FTTH & Microwave Antenna Deployment",
    featured: true,
    sortOrder: 1,
    isActive: true,
  },
  {
    name: "Dr. Sandeep Deshmukh",
    designation: "Senior Director (Hydrometrology)",
    company: "Central Water Commission Partner",
    content: "The Satellite Earth Receiving Station and Automatic Weather Stations installed by CSD Enterprises operate with round-the-clock reliability. Real-time telemetry data arrives uninterrupted during heavy monsoon seasons.",
    rating: 5,
    projectReference: "Satellite Earth Receiving Station",
    featured: true,
    sortOrder: 2,
    isActive: true,
  },
];

const BLOG_POSTS = [
  {
    title: "Best Practices in Explosion-Proof CCTV Deployment for Hydrocarbon Plants",
    slug: "explosion-proof-cctv-hydrocarbon-plants",
    excerpt: "Crucial considerations for flameproof enclosures, cable glands, and Zone-1 compliance in refineries and gas bottling plants.",
    content: "In hazardous process industries such as refineries and petrochemical facilities, standard surveillance hardware poses grave ignition risks. Industrial systems integrators must adhere strictly to PESO guidelines, utilizing certified flameproof (Ex d) or intrinsically safe (Ex i) enclosures. Furthermore, armored fiber-optic backbones ensure EMI immunity alongside fail-safe video delivery to emergency control centers.",
    coverImage: "/images/industrial-facility.jpg",
    author: "CSD Engineering Desk",
    authorRole: "Senior Systems Integrator",
    category: "Industrial Safety & CCTV",
    tags: ["Explosion-Proof", "CCTV", "PESO", "Refinery Safety"],
    readTime: "4 min read",
    publishedAt: new Date("2026-01-15"),
    featured: true,
    isPublished: true,
  },
  {
    title: "Architecting Offshore TSAT Telemetry Links in Deepwater Extraction Platforms",
    slug: "offshore-tsat-telemetry-deepwater-platforms",
    excerpt: "How CSD Enterprises engineers high-availability satellite telemetry channels for offshore SCADA monitoring at Mumbai High.",
    content: "Operating offshore telemetry platforms requires extreme resilience against marine salinity, high winds, and remote maintenance constraints. By deploying marine-grade TSAT satellite transceivers with automated link budget optimization and redundant SCADA modems, critical offshore platforms maintain 99.98% real-time telemetry uptime to shore control stations.",
    coverImage: "/images/automation-hero.jpg",
    author: "Telecom Operations Lead",
    authorRole: "Offshore Satcom Architect",
    category: "Offshore & Satcom",
    tags: ["Offshore", "Satcom", "SCADA", "Mumbai High"],
    readTime: "5 min read",
    publishedAt: new Date("2026-02-10"),
    featured: true,
    isPublished: true,
  },
  {
    title: "The Role of Solar-Powered Automatic Weather Stations in Flood Forecasting",
    slug: "solar-aws-stations-flood-forecasting",
    excerpt: "Integrating solar AWS telemetry nodes and satellite earth receiving stations for real-time hydrological early warnings.",
    content: "Hydrological forecasting demands unattended, solar-powered sensing stations in remote river catchment areas. Modern Automatic Weather Stations (AWS) combine ultrasonic rain sensors, water level transmitters, and INSAT satellite telemetry to stream flood predictions to central disaster response agencies before floodwaters peak.",
    coverImage: "/images/automation-hero.jpg",
    author: "Instrumentation Specialist",
    authorRole: "Hydrometrology Unit",
    category: "Hydrometrology & AWS",
    tags: ["Hydrometrology", "AWS", "Satellite Telemetry", "CWC"],
    readTime: "6 min read",
    publishedAt: new Date("2026-03-01"),
    featured: true,
    isPublished: true,
  },
];

const FAQS = [
  {
    question: "What industrial automation protocols and PLC platforms does CSD Enterprises support?",
    answer: "We support major industrial automation platforms including Siemens (TIA Portal / S7-1200 / S7-1500), Rockwell Automation / Allen-Bradley, Schneider Electric (Modicon), and ABB. We program and integrate protocols including Modbus RTU/TCP, Profinet, Profibus, Ethernet/IP, and OPC-UA.",
    category: "Industrial Automation",
    sortOrder: 0,
    isActive: true,
  },
  {
    question: "Are your CCTV and electrical installations certified for hazardous chemical environments?",
    answer: "Yes. Our team specializes in hazardous-area installations certified under PESO (Petroleum and Explosives Safety Organization) standards for Zone 1 and Zone 2 environments, including explosion-proof PTZ cameras, flameproof junction boxes, and armored cable glands.",
    category: "Surveillance & Safety",
    sortOrder: 1,
    isActive: true,
  },
  {
    question: "Does CSD Enterprises provide on-site engineering teams for offshore operations?",
    answer: "Yes, we deploy certified offshore engineers holding requisite offshore safety certifications (BOSIET/HUET) for installations and emergency maintenance at deepwater platforms such as Mumbai High.",
    category: "Offshore & Telecom",
    sortOrder: 2,
    isActive: true,
  },
  {
    question: "How do your Automatic Weather Stations (AWS) transmit data from remote locations?",
    answer: "Our solar-powered AWS systems utilize redundant multi-carrier 4G cellular IoT gateways with automatic fallback to INSAT or Iridium satellite telemetry to guarantee continuous transmission from inaccessible mountain or river basin sites.",
    category: "Hydrometrology",
    sortOrder: 3,
    isActive: true,
  },
  {
    question: "What is your typical turnaround time for an engineering proposal or RFQ?",
    answer: "For standard industrial requirements, our technical architects deliver preliminary engineering proposals within 24 to 48 hours. Turnkey multi-site government or PSU tenders are handled according to designated submission schedules.",
    category: "Procurement & SLAs",
    sortOrder: 4,
    isActive: true,
  },
  {
    question: "Can CSD Enterprises handle turnkey EPC projects spanning civil and electrical works?",
    answer: "Yes. From structural tower erection, civil trenches, optical fiber conduit laying, and UPS power rooms to final system commissioning and operator training, we manage end-to-end turnkey project execution.",
    category: "General",
    sortOrder: 5,
    isActive: true,
  },
];

const CTA_CONTENT = {
  badge: "Engineering Turnkey Excellence",
  heading: "Ready to Upgrade Your Industrial Infrastructure?",
  highlightedText: "Partner with CSD Enterprises Today.",
  description:
    "Consult directly with senior instrumentation engineers and telecom specialists. From hazardous-zone surveillance to offshore satellite SCADA, we provide rigorous proposals and turnkey execution.",
  primaryButtonText: "Initiate Technical Consultation",
  primaryButtonUrl: "#contact",
  secondaryButtonText: "Call Engineering Desk: +91 8355976842",
  secondaryButtonUrl: "tel:+918355976842",
  backgroundImage: "/images/industrial-facility.jpg",
  emergencyContactText: "24/7 Operations Helpline",
  emergencyContactPhone: "+91 8355976842 / 9022248869",
  isActive: true,
  updatedAt: new Date(),
};

async function seed() {
  console.log("Connecting to MongoDB Atlas...");
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("✓ Connected successfully to MongoDB Atlas.");

    const db = client.db("csd_enterprises");

    // 1. Website Settings
    console.log("Seeding Website Settings...");
    await db.collection("websiteSettings").updateOne(
      {},
      { $set: WEBSITE_SETTINGS },
      { upsert: true }
    );
    console.log("✓ Website settings updated.");

    // 2. Navigation
    console.log("Seeding Navigation Items...");
    const navCol = db.collection("navigation");
    await navCol.deleteMany({});
    await navCol.insertMany(NAVIGATION_ITEMS);
    console.log(`✓ Inserted ${NAVIGATION_ITEMS.length} navigation items.`);

    // 3. Home Sections Order
    console.log("Seeding Home Sections Configuration...");
    const sectionsCol = db.collection("homeSections");
    await sectionsCol.deleteMany({});
    await sectionsCol.insertMany(HOME_SECTIONS);
    console.log(`✓ Inserted ${HOME_SECTIONS.length} home sections.`);

    // 4. Hero Slides
    console.log("Seeding Hero Slides...");
    const heroCol = db.collection("heroSlides");
    await heroCol.deleteMany({});
    await heroCol.insertMany(HERO_SLIDES);
    console.log(`✓ Inserted ${HERO_SLIDES.length} hero slides.`);

    // 5. Statistics
    console.log("Seeding Statistics...");
    const statsCol = db.collection("statistics");
    await statsCol.deleteMany({});
    await statsCol.insertMany(STATISTICS);
    console.log(`✓ Inserted ${STATISTICS.length} statistics.`);

    // 6. About Content
    console.log("Seeding About Content...");
    await db.collection("aboutContent").updateOne(
      {},
      { $set: ABOUT_CONTENT },
      { upsert: true }
    );
    console.log("✓ About content updated.");

    // 7. Services
    console.log("Seeding Services...");
    const servicesCol = db.collection("services");
    await servicesCol.deleteMany({});
    await servicesCol.insertMany(SERVICES);
    console.log(`✓ Inserted ${SERVICES.length} services.`);

    // 8. Industries
    console.log("Seeding Industries...");
    const indCol = db.collection("industries");
    await indCol.deleteMany({});
    await indCol.insertMany(INDUSTRIES);
    console.log(`✓ Inserted ${INDUSTRIES.length} industries.`);

    // 9. Projects
    console.log("Seeding Projects...");
    const projectsCol = db.collection("projects");
    await projectsCol.deleteMany({});
    await projectsCol.insertMany(PROJECTS);
    console.log(`✓ Inserted ${PROJECTS.length} projects.`);

    // 10. Clients
    console.log("Seeding Clients...");
    const clientsCol = db.collection("clients");
    await clientsCol.deleteMany({});
    await clientsCol.insertMany(CLIENTS);
    console.log(`✓ Inserted ${CLIENTS.length} clients.`);

    // 11. Certifications
    console.log("Seeding Certifications...");
    const certCol = db.collection("certifications");
    await certCol.deleteMany({});
    await certCol.insertMany(CERTIFICATIONS);
    console.log(`✓ Inserted ${CERTIFICATIONS.length} certifications.`);

    // 12. Testimonials
    console.log("Seeding Testimonials...");
    const testCol = db.collection("testimonials");
    await testCol.deleteMany({});
    await testCol.insertMany(TESTIMONIALS);
    console.log(`✓ Inserted ${TESTIMONIALS.length} testimonials.`);

    // 13. Blog Posts
    console.log("Seeding Blog Posts...");
    const blogCol = db.collection("blogPosts");
    await blogCol.deleteMany({});
    await blogCol.insertMany(BLOG_POSTS);
    console.log(`✓ Inserted ${BLOG_POSTS.length} blog posts.`);

    // 14. FAQs
    console.log("Seeding FAQs...");
    const faqsCol = db.collection("faqs");
    await faqsCol.deleteMany({});
    await faqsCol.insertMany(FAQS);
    console.log(`✓ Inserted ${FAQS.length} FAQs.`);

    // 15. CTA Content
    console.log("Seeding CTA Content...");
    await db.collection("ctaContent").updateOne(
      {},
      { $set: CTA_CONTENT },
      { upsert: true }
    );
    console.log("✓ CTA content updated.");

    // Indexes
    console.log("Creating/Verifying Indexes...");
    await projectsCol.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await servicesCol.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await blogCol.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await indCol.createIndex({ slug: 1 }, { unique: true, sparse: true });
    await sectionsCol.createIndex({ sortOrder: 1 });
    await statsCol.createIndex({ sortOrder: 1 });
    await navCol.createIndex({ sortOrder: 1 });

    console.log("\n========================================================");
    console.log("✓ FULL CSD ENTERPRISES CMS SEEDING COMPLETED SUCCESSFULLY!");
    console.log("========================================================\n");
  } catch (err) {
    console.error("Seeding failed with error:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seed();
