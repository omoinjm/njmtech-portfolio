"use client";

import { motion } from "framer-motion";

export function PageLoader() {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Spinning ring + N logo */}
      <div className="relative flex items-center justify-center">
        {/* Outer spinning gradient ring */}
        <div className="absolute h-24 w-24 animate-spin rounded-full border-4 border-transparent border-t-primary" />
        {/* Secondary slower counter-spin for depth */}
        <div
          className="absolute h-20 w-20 animate-spin rounded-full border-4 border-transparent border-b-primary opacity-40"
          style={{ animationDuration: "1.8s", animationDirection: "reverse" }}
        />
        {/* N avatar */}
        <div className="gradient-bg flex h-14 w-14 items-center justify-center rounded-xl shadow-lg">
          <span className="text-2xl font-bold text-white">N</span>
        </div>
      </div>

      {/* Bouncing dots */}
      <div className="flex items-center gap-1.5">
        {[0, 150, 300].map((delay) => (
          <div
            key={delay}
            className="h-2 w-2 animate-bounce rounded-full bg-primary"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </motion.div>
  );
}
