import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function ProjectsPage() {
  const locale = await getLocale();
  redirect(locale === "en" ? "/work" : `/${locale}/work`);
}
