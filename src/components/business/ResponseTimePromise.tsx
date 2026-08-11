"use client";

import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { RESPONSE_TIME } from "@/lib/business-content";

export function ResponseTimePromise() {
  const t = useTranslations("business.responseTime");

  return (
    <div className="inline-flex items-center gap-3 px-5 py-3 rounded-full border border-accent/30 bg-accent/5 text-sm">
      <Clock className="w-4 h-4 text-accent shrink-0" aria-hidden />
      <span>{t("message", { time: RESPONSE_TIME })}</span>
    </div>
  );
}
