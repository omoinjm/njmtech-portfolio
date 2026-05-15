"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";
import type { FooterModel, MenuModel } from "@/types";

const SOCIAL_LINKS = [
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/njmalaza", Icon: Linkedin },
  { id: "twitter",  label: "Twitter",  href: "https://twitter.com/nhlanhlamalaza_", Icon: Twitter },
  { id: "github",   label: "GitHub",   href: "https://github.com/omoinjm",          Icon: Github },
];

type Props = {
  pages: MenuModel[];
  socialLinks?: FooterModel[];
};

export const RightSideNav = ({ pages, socialLinks }: Props) => {
  const pathname = usePathname();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pageItems = pages.map((p) => ({ id: String(p.id), label: p.label, href: p.url }));

  return (
    <nav
      aria-label="Page navigation"
      className="fixed right-5 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-end gap-3"
    >
      {/* Page links */}
      {pageItems.map(({ id, label, href }) => {
        const active = pathname === href;
        const hovered = hoveredId === `page-${id}`;
        return (
          <Link
            key={id}
            href={href}
            aria-label={label}
            onMouseEnter={() => setHoveredId(`page-${id}`)}
            onMouseLeave={() => setHoveredId(null)}
            className="flex items-center gap-2.5 group"
          >
            <AnimatePresence>
              {(active || hovered) && (
                <motion.span
                  key="label"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.18 }}
                  className="text-[10px] font-semibold tracking-[0.18em] uppercase text-foreground select-none"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
            <motion.span
              animate={{
                width: active ? 10 : 5,
                height: active ? 10 : 5,
                opacity: active ? 1 : hovered ? 0.7 : 0.35,
              }}
              transition={{ duration: 0.2 }}
              className="rounded-full bg-primary block shrink-0"
            />
          </Link>
        );
      })}

      {/* Social icons */}
      <>
        <span className="w-px h-5 bg-border/50 self-center my-1" />
        {SOCIAL_LINKS.map(({ id, label, href, Icon }) => (
          <a
            key={id}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="text-muted-foreground/50 hover:text-primary transition-colors duration-200"
          >
            <Icon size={14} strokeWidth={1.5} />
          </a>
        ))}
      </>
    </nav>
  );
};
