"use client";

import Link from "next/link";
import * as LucideIcons from "lucide-react";
import { useTranslations } from "next-intl";
import { FooterModel } from "@/types";

export const Footer = ({ data }) => {
  const t = useTranslations("footer");
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
              © {currentYear} {t("copyright")}
            </p>
            <div className="hidden md:flex flex-col gap-2.5 mt-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/45">
                  {t("guides_category")}
                </span>
                <span className="text-muted-foreground/20 text-xs" aria-hidden="true">
                  |
                </span>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-keyboard-guide"))}
                  className="text-xs text-muted-foreground/60 hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                >
                  {t("keyboard_guide")}
                </button>
                <span className="text-muted-foreground/30 text-xs" aria-hidden="true">
                  ·
                </span>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-shortcuts"))}
                  className="text-xs text-muted-foreground/60 hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                >
                  {t("keyboard_shortcuts")}
                </button>
                <span className="text-muted-foreground/30 text-xs" aria-hidden="true">
                  ·
                </span>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent("open-seo-guide"))}
                  className="text-xs text-muted-foreground/60 hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                >
                  {t("seo_guide")}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground/45">
                  {t("mail_category")}
                </span>
                <span className="text-muted-foreground/20 text-xs" aria-hidden="true">
                  |
                </span>
                <Link
                  href="/mail-service-policy"
                  className="text-xs text-muted-foreground/60 hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                >
                  {t("mail_service_policy")}
                </Link>
                <span className="text-muted-foreground/30 text-xs" aria-hidden="true">
                  ·
                </span>
                <Link
                  href="/mail-service-terms"
                  className="text-xs text-muted-foreground/60 hover:text-accent transition-colors underline decoration-dotted underline-offset-4"
                >
                  {t("mail_service_terms")}
                </Link>
              </div>

              <Link
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground/60 hover:text-accent transition-colors underline decoration-dotted underline-offset-4 w-fit"
              >
                {t("llms_txt")}
              </Link>
            </div>
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

