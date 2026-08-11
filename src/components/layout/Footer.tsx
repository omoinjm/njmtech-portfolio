"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { PRIMARY_SITE_NAV } from "@/lib/site-navigation";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { SocialLinkIcon } from "@/components/layout/SocialLinkIcon";

const FOOTER_NAV_I18N: Record<string, string> = {
  "/services": "services",
  "/work": "work",
  "/about": "about",
  "/contact": "contact",
  "/blog": "blog",
};

export const Footer = ({ data: _data }) => {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
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

            <nav
              aria-label="Site sections"
              className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 mt-4"
            >
              {PRIMARY_SITE_NAV.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className="text-sm font-medium text-foreground/80 hover:text-accent transition-colors"
                >
                  {tNav(
                    (FOOTER_NAV_I18N[item.path] ?? item.name.toLowerCase()) as
                      | "services"
                      | "work"
                      | "about"
                      | "contact"
                      | "blog",
                  )}
                </Link>
              ))}
            </nav>

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
            {SOCIAL_LINKS.map((social) => (
              <SocialLinkIcon key={social.id} social={social} size={20} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

