"use client";

import Image from "next/image";
import type { ElementType } from "react";
import * as LucideIcons from "lucide-react";
import type { FooterModel } from "@/types";

const LABEL_TO_LUCIDE: Record<string, keyof typeof LucideIcons> = {
  LinkedIn: "Linkedin",
  Facebook: "Facebook",
  Instagram: "Instagram",
  Twitter: "Twitter",
  GitHub: "Github",
  Github: "Github",
};

function isImageIcon(icon: string): boolean {
  return icon.startsWith("http://") || icon.startsWith("https://");
}

function getLucideIcon(social: FooterModel) {
  const candidates = [
    social.icon,
    LABEL_TO_LUCIDE[social.label],
    social.label,
  ].filter(Boolean) as string[];

  for (const name of candidates) {
    if (isImageIcon(name)) continue;
    const Icon = LucideIcons[name as keyof typeof LucideIcons];
    if (typeof Icon === "function" || typeof Icon === "object") {
      return Icon as ElementType;
    }
  }

  return null;
}

interface SocialLinkIconProps {
  social: FooterModel;
  size?: number;
  className?: string;
}

export function SocialLinkIcon({
  social,
  size = 24,
  className = "text-muted-foreground hover:text-foreground transition-colors",
}: SocialLinkIconProps) {
  const imageSrc = isImageIcon(social.icon) ? social.icon : null;
  const LucideIcon = imageSrc ? null : getLucideIcon(social);

  return (
    <a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={social.label}
      title={social.label}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt=""
          width={size}
          height={size}
          className="opacity-80 hover:opacity-100 transition-opacity"
          aria-hidden
        />
      ) : LucideIcon ? (
        <LucideIcon size={size} aria-hidden />
      ) : (
        <LucideIcons.Link size={size} aria-hidden />
      )}
    </a>
  );
}
