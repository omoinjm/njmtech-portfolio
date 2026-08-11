"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { MenuModel } from "@/types";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { getGeneralQuoteUrl } from "@/lib/business-content";
import * as LucideIcons from "lucide-react";
import { AccentThemePicker } from "@/components/layout/AccentThemePicker";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SocialLinkIcon } from "@/components/layout/SocialLinkIcon";

function normalizeNavUrl(url: string): string {
  if (url === "/projects") return "/work";
  return url;
}

interface NavbarProps {
  navMenu: MenuModel[];
}

export const Navbar = ({ navMenu }: NavbarProps) => {
  const t = useTranslations("nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const pages = navMenu.map((link) => ({
    ...link,
    url: normalizeNavUrl(link.url),
  }));

  const whatsappUrl = getGeneralQuoteUrl();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      const shortcuts: Record<string, string> = {};
      pages.forEach((link, index) => {
        if (index < 8) {
          shortcuts[String(index + 2)] = link.url;
        }
      });

      if (event.altKey && event.key === "1") router.push("/");
      if (event.altKey && shortcuts[event.key]) router.push(shortcuts[event.key]);
      if (event.key === "Escape" && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, pages, router]);

  const isActive = (href: string) => {
    const normalized = normalizeNavUrl(href);
    return (
      pathname === normalized ||
      pathname.endsWith(normalized) ||
      (normalized === "/work" && pathname.endsWith("/projects"))
    );
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-md shadow-lg py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className="text-2xl font-bold gradient-text justify-self-start">
            NJM<span className="text-foreground">TECH</span>
          </Link>

          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center justify-center gap-4 lg:gap-6 xl:gap-8"
          >
            {pages.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                className={`text-sm font-semibold tracking-wide transition-colors whitespace-nowrap ${
                  isActive(link.url)
                    ? "gradient-text"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center justify-end gap-3">
            <LanguageSwitcher />
            <AccentThemePicker />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 px-5 py-2 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2 text-sm"
            >
              <LucideIcons.MessageCircle className="w-4 h-4" />
              {t("whatsapp")}
            </a>
          </div>

          <button
            className="md:hidden text-foreground z-50 relative justify-self-end col-start-3"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <LucideIcons.X size={24} />
            ) : (
              <LucideIcons.Menu size={24} />
            )}
          </button>
        </div>
      </motion.nav>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full gradient-bg shadow-lg flex items-center justify-center hover:opacity-90 transition-opacity"
        aria-label={t("whatsapp")}
      >
        <LucideIcons.MessageCircle className="w-6 h-6 text-foreground" />
      </a>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background flex flex-col md:hidden"
          >
            <div className="h-16" />
            <div className="flex-1 flex flex-col items-center justify-center gap-10 px-8">
              {pages.map((link) => (
                <Link
                  key={link.id}
                  href={link.url}
                  className={`text-3xl font-semibold tracking-wide transition-colors ${
                    isActive(link.url)
                      ? "gradient-text"
                      : "text-foreground hover:text-muted-foreground"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col items-center gap-6 pb-12 pt-8 border-t border-border">
              <AccentThemePicker />
              <LanguageSwitcher />
              <div className="flex items-center gap-8">
                {SOCIAL_LINKS.map((social) => (
                  <SocialLinkIcon key={social.id} social={social} size={28} />
                ))}
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <LucideIcons.MessageCircle className="w-5 h-5" />
                {t("whatsapp")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
