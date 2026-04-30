"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { FooterModel } from "@/types";

export const Footer = ({ data }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <Link href="/" className="text-2xl font-bold gradient-text">
              NJM<span className="text-foreground">TECH</span>
            </Link>
            <p className="text-muted-foreground text-sm mt-1">
              © {currentYear} All rights reserved.
            </p>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("open-shortcuts"))}
              className="hidden md:inline-block text-xs text-muted-foreground/60 hover:text-accent transition-colors mt-2 underline decoration-dotted underline-offset-4"
            >
              Keyboard Shortcuts
            </button>
          </div>

          {/* Social Links */}
          <div className="flex gap-4">
            {data.map((social: FooterModel) => {
              const Icon = LucideIcons[social.label];
              return (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  {Icon ? <Icon size={20} /> : <span>{social.label}</span>}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
