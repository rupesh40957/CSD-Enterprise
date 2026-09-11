import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#060b18" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://csdenterprises.in"),
  title: {
    default: "CSD Enterprises | Industrial Automation, IT Infrastructure & System Integration",
    template: "%s | CSD Enterprises",
  },
  description:
    "Delivering mission-critical PLC/SCADA, CCTV Surveillance, Hydrometrology AWS, IT Networks, and Offshore Satcom solutions across India since 2019.",
  keywords: [
    "Industrial Automation",
    "PLC SCADA System Integrator",
    "Explosion Proof CCTV Surveillance",
    "Hydrometrology Automatic Weather Stations",
    "IT Network Infrastructure",
    "Offshore Satcom Mumbai High",
    "CSD Enterprises Mumbai",
    "B2B System Integration India",
  ],
  authors: [{ name: "CSD Enterprises" }],
  creator: "CSD Enterprises",
  publisher: "CSD Enterprises",
  icons: {
    icon: "/logo/csd-favicon.png",
    apple: "/logo/csd-favicon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://csdenterprises.in",
    siteName: "CSD Enterprises",
    title: "CSD Enterprises | Industrial Automation & System Integration",
    description:
      "Enterprise systems integration, PLC/DCS, SCADA, explosion-proof CCTV, AWS hydrometrology, and mission-critical IT infrastructure for offshore & onshore clients.",
    images: [
      {
        url: "/logo/csd-logo.png",
        width: 800,
        height: 600,
        alt: "CSD Enterprises Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CSD Enterprises | Industrial Automation & IT Infrastructure",
    description:
      "Offshore & onshore systems integration, PLC/SCADA, CCTV surveillance, and hydrometrology solutions since 2019.",
    images: ["/logo/csd-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('csd_theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (stored === 'light' || (!stored && !prefersDark)) {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
