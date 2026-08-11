"use client";

import Link from "next/link";
import { Mail, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  BUSINESS_CONTACT,
  RESPONSE_TIME,
  getGeneralQuoteUrl,
} from "@/lib/business-content";
import { Button } from "@/components/ui/button";

interface ContactCTAProps {
  variant?: "section" | "compact";
  showFormLink?: boolean;
}

export function ContactCTA({
  variant = "section",
  showFormLink = true,
}: ContactCTAProps) {
  const t = useTranslations("business.contactCta");

  const isCompact = variant === "compact";

  return (
    <div
      className={
        isCompact
          ? "flex flex-col sm:flex-row items-center gap-4"
          : "rounded-2xl border border-border bg-card/60 p-8 md:p-10 text-center"
      }
    >
      {!isCompact && (
        <>
          <h2 className="text-2xl md:text-3xl font-bold mb-2">{t("heading")}</h2>
          <p className="text-muted-foreground mb-2 max-w-lg mx-auto">{t("subheading")}</p>
          <p className="text-sm text-accent font-medium mb-6">
            {t("response_time", { time: RESPONSE_TIME })}
          </p>
        </>
      )}

      <div
        className={`flex flex-col sm:flex-row gap-3 ${isCompact ? "" : "justify-center"}`}
      >
        <Button asChild size={isCompact ? "default" : "lg"} className="rounded-full">
          <a
            href={getGeneralQuoteUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            {t("whatsapp")}
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          size={isCompact ? "default" : "lg"}
          className="rounded-full"
        >
          <a href={`mailto:${BUSINESS_CONTACT.email}`}>
            <Mail className="w-4 h-4 mr-2" />
            {BUSINESS_CONTACT.email}
          </a>
        </Button>
        {showFormLink && (
          <Button
            asChild
            variant="ghost"
            size={isCompact ? "default" : "lg"}
            className="rounded-full"
          >
            <Link href="/contact">{t("form_link")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
