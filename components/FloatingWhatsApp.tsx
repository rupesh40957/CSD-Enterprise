"use client";

import React, { useState } from "react";
import { MessageSquare } from "lucide-react";

export default function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918355976842";
  const defaultMessage = encodeURIComponent(
    "Hello CSD Enterprises, I would like to inquire about your B2B industrial automation and IT infrastructure solutions."
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip Label */}
      <div
        className={`hidden sm:block px-3 py-1.5 rounded-lg bg-navy-950/90 text-white text-xs font-semibold shadow-lg border border-cyan-500/30 backdrop-blur-md transition-all duration-200 ${
          hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        Chat on WhatsApp
      </div>

      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct B2B Inquiry on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-13 h-13 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 hover:from-emerald-500 hover:to-emerald-300 text-white shadow-xl shadow-emerald-500/25 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative"
      >
        {/* Animated Radar Ping */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-navy-950"></span>
        </span>

        {/* WhatsApp Icon SVG */}
        <svg
          className="w-6 h-6 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.476-.15-.676.15-.201.3-.777.979-.953 1.18-.175.2-.351.226-.652.075-.3-.15-1.267-.467-2.414-1.49-1.077-.96-1.805-2.146-2.016-2.507-.211-.361-.023-.556.128-.706.136-.135.301-.351.452-.527.15-.175.2-.3.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.632-.928-2.235-.245-.588-.493-.508-.677-.518l-.578-.01c-.2 0-.526.075-.802.376-.276.3-1.053 1.029-1.053 2.509s1.078 2.91 1.228 3.111c.15.2 2.122 3.24 5.141 4.544.718.31 1.278.496 1.716.635.722.23 1.378.197 1.898.12.578-.088 1.78-.727 2.03-1.43.25-.702.25-1.304.176-1.43-.076-.125-.276-.2-.577-.35zM12.042 21.92c-1.77 0-3.504-.476-5.023-1.378l-.36-.213-3.731.979.996-3.638-.234-.373a9.923 9.923 0 0 1-1.523-5.257c0-5.49 4.472-9.957 9.97-9.957 2.664 0 5.168 1.037 7.05 2.921 1.882 1.883 2.918 4.388 2.917 7.057 0 5.492-4.473 9.86-9.86 9.86zM12.042 0C5.397 0 0 5.394 0 12.036c0 2.12.553 4.19 1.603 6.012L0 24l6.134-1.607a11.96 11.96 0 0 0 5.908 1.554h.005c6.643 0 12.04-5.395 12.04-12.04 0-3.218-1.253-6.244-3.528-8.522C18.284 1.25 15.258 0 12.042 0z" />
        </svg>
      </a>
    </div>
  );
}
