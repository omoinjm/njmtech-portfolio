import "@/index.css";
import { ACCENT_THEME_BOOT_SCRIPT } from "@/lib/accent-theme";
import { Inter } from "next/font/google";
import { siteConfig } from "@/utils/seo";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="me" href={siteConfig.social.linkedin} />
        <link rel="me" href={siteConfig.social.github} />
        <link rel="me" href={siteConfig.social.twitterUrl} />
        <script dangerouslySetInnerHTML={{ __html: ACCENT_THEME_BOOT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
