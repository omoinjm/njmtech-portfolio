"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuModel } from "@/types";
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  console.log(data);

  return (
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
        {/*
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="NJMTECH Logo"
            width={50}
            height={50}
            priority
          />
        </Link>
        */}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {data.map((link: MenuModel) => (
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
          {socialLinks.map((social) => {
            // 1. Must be inside curly braces to declare variables
            // 2. Use 'social' (the parameter name) instead of 'link'
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
                {/* Render the icon if found, otherwise fallback to label text */}
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
          className="md:hidden text-foreground"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
        >
          <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
            {data.map((link: MenuModel) => (
              <Link
                key={link.id}
                href={link.url}
                className="text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 pt-4 border-t border-border">
              {socialLinks.map((social) => {
                // 1. Must be inside curly braces to declare variables
                // 2. Use 'social' (the parameter name) instead of 'link'
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
                    {/* Render the icon if found, otherwise fallback to label text */}
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
              {/*{socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}*/}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};
