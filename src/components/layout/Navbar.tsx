"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FooterModel, MenuModel } from "@/types";
import * as LucideIcons from "lucide-react";

const socialLinks = [
  { icon: "Github", href: "https://github.com/omoinjm", label: "GitHub" },
  { icon: "Linkedin", href: "https://linkedin.com", label: "LinkedIn" },
  {
    icon: "Twitter",
    href: "https://twitter.com/nhlanhlamalaza_",
    label: "Twitter",
  },
];

export const Navbar = ({ data }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const pages = data?.nav_menu ?? [];
  const links = data?.nav_footer ?? [];

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

  const isActive = (href: string) => pathname === href;
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
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold gradient-text">
            NJM<span className="text-foreground">TECH</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {pages.map((link: MenuModel) => (
              <Link
                key={link.id}
                href={link.url}
                className={`nav-link ${isActive(link.url) ? "active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Links & Connect Button */}
          <div className="hidden md:flex items-center gap-4">
            {links.map((social: FooterModel) => {
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
            <Link
              href="https://bio.njmtech.co.za/"
              target="_blank"
              className="ml-4 px-6 py-2 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-opacity"
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
              <div className="flex items-center gap-8">
                {socialLinks.map((social) => {
                  const Icon = LucideIcons[social.icon];
                  return (
                    <a
                      key={social.label}
                      href={social.href}
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
