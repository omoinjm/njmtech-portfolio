"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { MenuModel } from "@/types";
import { MAIN_SITE_NAV } from "@/lib/site-navigation";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { getGeneralQuoteUrl } from "@/lib/business-content";
import * as LucideIcons from "lucide-react";
import { AccentThemePicker } from "@/components/layout/AccentThemePicker";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SocialLinkIcon } from "@/components/layout/SocialLinkIcon";

const NAV_I18N_KEYS: Record<string, string> = {
  "/services": "services",
  "/work": "work",
  "/about": "about",
  "/contact": "contact",
};

function getNavLabelKey(url: string): string {
  return NAV_I18N_KEYS[url] ?? url.replace("/", "");
}

export const Navbar = ({ data }) => {
  const t = useTranslations("nav");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const fallbackPages = MAIN_SITE_NAV.map((item, index) => ({
    id: index,
    label: item.name,
    icon: "",
    url: item.path,
  }));

  const pages =
    data?.nav_menu && data.nav_menu.length > 0
      ? data.nav_menu.filter(
          (link: MenuModel) =>
            !link.url.includes("/blog") && link.url !== "/projects",
        )
      : fallbackPages;

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

      if (event.altKey && event.key === "1") router.push("/");
      if (event.altKey && event.key === "2") router.push("/services");
      if (event.altKey && event.key === "3") router.push("/work");
      if (event.altKey && event.key === "4") router.push("/about");
      if (event.altKey && event.key === "5") router.push("/contact");
      if (event.key === "Escape" && isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, router]);

  const isActive = (href: string) => pathname === href || pathname.endsWith(href);

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
            className="hidden md:flex items-center justify-center gap-6 lg:gap-8"
          >
            {pages.map((link: MenuModel) => (
              <Link
                key={link.id}
                href={link.url}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  isActive(link.url)
                    ? "gradient-text"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t(getNavLabelKey(link.url) as "services" | "work" | "about" | "contact")}
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
              {pages.map((link: MenuModel) => (
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
                  {t(getNavLabelKey(link.url) as "services" | "work" | "about" | "contact")}
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
