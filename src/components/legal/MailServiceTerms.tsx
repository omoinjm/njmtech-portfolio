"use client";

import { useTranslations } from "next-intl";
import { siteConfig } from "@/utils/seo";

export const MailServiceTerms = () => {
  const t = useTranslations("mailServiceTerms");

  const sections = [
    "acceptance",
    "service_description",
    "eligibility",
    "acceptable_use",
    "prohibited_conduct",
    "newsletter",
    "availability",
    "intellectual_property",
    "disclaimer",
    "limitation_liability",
    "termination",
    "governing_law",
    "changes",
    "contact",
  ] as const;

  return (
    <section className="container mx-auto px-4 py-16 max-w-3xl">
      <header className="mb-10">
        <p className="text-sm text-muted-foreground mb-2">{t("label")}</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-3">{t("last_updated")}</p>
        <p className="text-muted-foreground mt-4 leading-relaxed">{t("intro")}</p>
      </header>

      <div className="space-y-8 text-foreground/90">
        {sections.map((section) => (
          <article key={section}>
            <h2 className="text-xl font-semibold mb-3">{t(`${section}.title`)}</h2>
            <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
              {t(`${section}.body`, {
                siteName: siteConfig.name,
                siteUrl: siteConfig.url,
                email: siteConfig.email,
                owner: "Nhlanhla Junior Malaza",
              })}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};
