import { getTranslations } from "next-intl/server";
import { pageConfig } from '@/utils/seo';

export default async function NotFound() {
  const t = await getTranslations("not_found");
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-6xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">{t("message")}</p>
        <a
          href="/"
          className="px-6 py-3 rounded-full gradient-bg text-foreground font-semibold hover:opacity-90 transition-opacity inline-block"
        >
          {t("go_home")}
        </a>
      </div>
    </div>
  );
}
