import type { NextConfig } from "next";
import os from "os";

function getLocalNetworkOrigins(): string[] {
  const origins = new Set<string>([
    "192.168.31.123",
    "localhost",
    "127.0.0.1",
  ]);

  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === "IPv4" && !net.internal) {
          origins.add(net.address);
        }
      }
    }
  } catch {
    // fallback
  }

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  // Allow devices on the local Wi-Fi / LAN (e.g. mobile phones on 192.168.31.123) to load dev resources & HMR
  allowedDevOrigins: getLocalNetworkOrigins(),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;
