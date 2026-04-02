"use client";

import { motion } from "framer-motion";
import { QrCode, Sparkles } from "lucide-react";
import QRCode from "react-qr-code";
import { siteConfig } from "@/utils/seo";

export const QRCard = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-accent/5 to-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border"
        >
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm text-muted-foreground">Scan to visit my portfolio</span>
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-6xl font-bold gradient-text"
        >
          Nhlanhla Junior Malaza
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-muted-foreground"
        >
          Software Developer · DevOps Engineer · UI/UX Designer
        </motion.p>

        {/* QR Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="gradient-border rounded-2xl p-8"
        >
          {/* Icon header */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <QrCode className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Portfolio QR
            </span>
          </div>

          {/* QR Code */}
          <div className="p-4 rounded-xl bg-white">
            <QRCode
              value={siteConfig.url}
              size={220}
              bgColor="#ffffff"
              fgColor="#0f2b30"
              level="H"
            />
          </div>

          {/* URL */}
          <p className="mt-6 text-sm font-mono gradient-text font-semibold tracking-wide">
            {siteConfig.url.replace("https://", "")}
          </p>
        </motion.div>

        {/* Print hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-muted-foreground"
        >
          Tip: Use your browser&apos;s print function to save this as a PDF
        </motion.p>
      </div>
    </section>
  );
};
