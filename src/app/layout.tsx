import "@/index.css";
import { ACCENT_THEME_BOOT_SCRIPT } from "@/lib/accent-theme";
import { Inter } from "next/font/google";
import { siteConfig } from "@/utils/seo";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <link rel="me" href={siteConfig.social.linkedin} />
        <link rel="me" href={siteConfig.social.github} />
        <link rel="me" href={siteConfig.social.twitterUrl} />
        <script dangerouslySetInnerHTML={{ __html: ACCENT_THEME_BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
