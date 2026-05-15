"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FooterModel, MenuModel } from "@/types";
import * as LucideIcons from "lucide-react";
import { AccentThemePicker } from "@/components/layout/AccentThemePicker";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";


export const Navbar = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const pages = data?.nav_menu ?? [];
  const socialLinks: FooterModel[] = data?.nav_footer ?? [];

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if no input/textarea is focused
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Alt + 1: Home
      if (event.altKey && event.key === "1") {
        router.push("/");
      }
      // Alt + 2: Projects
      if (event.altKey && event.key === "2") {
        router.push("/projects");
      }
      // Alt + 3: Contact
      if (event.altKey && event.key === "3") {
        router.push("/contact");
      }
      // Esc: Close mobile menu
      if (event.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen, router]);

  const isActive = (href: string) => pathname === href;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
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
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Desktop: logo left, theme picker + Links right — nav links live in RightSideNav */}
          <Link href="/" className="text-2xl font-bold gradient-text">
            NJM<span className="text-foreground">TECH</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <AccentThemePicker />
            <Link
              href="https://bio.njmtech.co.za/"
              target="_blank"
              className="ml-2 px-6 py-2 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Links
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground z-50 relative"
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

      {/* Mobile Menu — full-screen overlay, sibling to nav so fixed positioning works correctly */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background flex flex-col md:hidden"
          >
            {/* Spacer matching navbar height */}
            <div className="h-16" />

            {/* Nav links — vertically centred in the remaining space */}
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
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Bottom — social icons + connect button */}
            <div className="flex flex-col items-center gap-6 pb-12 pt-8 border-t border-border">
              <AccentThemePicker />
              <LanguageSwitcher />
              <div className="flex items-center gap-8">
                {socialLinks.map((social) => {
                  const Icon = LucideIcons[social.icon as keyof typeof LucideIcons] as React.ElementType | undefined;
                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={social.label}
                    >
                      {Icon ? <Icon size={24} /> : <span>{social.label}</span>}
                    </a>
                  );
                })}
              </div>
              <Link
                href="https://bio.njmtech.co.za/"
                target="_blank"
                className="px-8 py-3 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-opacity"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Links
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
