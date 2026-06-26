"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  Circle,
  ExternalLink,
} from "lucide-react";

/* ─── Personal checklist data ─── */
const steps = [
  {
    title: "Submit to Google Search Console",
    priority: "high",
    items: [
      { text: "Go to search.google.com/search-console and add njmtech.co.za", done: false, link: "https://search.google.com/search-console" },
      { text: "Site auto-verifies (HTML file + meta tag already in place ✅)", done: true },
      { text: "Submit sitemap: njmtech.co.za/sitemap.xml", done: false, link: "https://search.google.com/search-console" },
      { text: 'URL Inspection → njmtech.co.za → "Request Indexing"', done: false, link: "https://search.google.com/search-console" },
      { text: "Repeat Request Indexing for /projects and /contact", done: false, link: "https://search.google.com/search-console" },
    ],
  },
  {
    title: "Build Off-Page Identity Signals",
    priority: "high",
    items: [
      { text: "LinkedIn: add https://njmtech.co.za as your website", done: false, link: "https://www.linkedin.com/in/njmalaza" },
      { text: "GitHub: set Website field to https://njmtech.co.za", done: false, link: "https://github.com/njmalaza" },
      { text: "Twitter/X: add njmtech.co.za to your bio link", done: false, link: "https://twitter.com/njmalaza" },
      { text: "Create a Google Business Profile for NJMTech", done: false, link: "https://business.google.com" },
    ],
  },
  {
    title: "Validate Structured Data",
    priority: "medium",
    items: [
      { text: "Rich Results Test: test njmtech.co.za (4 schemas should appear)", done: false, link: "https://search.google.com/test/rich-results" },
      { text: "Schema Validator: verify Person + Organization schemas", done: false, link: "https://validator.schema.org" },
      { text: "PageSpeed Insights: aim for 90+ on mobile & desktop", done: false, link: "https://pagespeed.web.dev" },
    ],
  },
  {
    title: "Monitor Rankings",
    priority: "medium",
    items: [
      { text: "Search Console → Performance → filter by your name queries", done: false, link: "https://search.google.com/search-console" },
      { text: 'Check: "Nhlanhla Junior Malaza" → target position 1', done: false },
      { text: 'Check: "njmtech" → target position 1', done: false },
      { text: "Check Coverage tab for any indexing errors", done: false, link: "https://search.google.com/search-console" },
    ],
  },
];

const priorityColors: Record<string, string> = {
  high: "bg-red-500/10 text-red-400 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

/* ─── Public guide data ─── */
const sections = [
  {
    title: "On-Page SEO",
    badge: "Start here",
    badgeClass: "bg-green-500/10 text-green-400 border-green-500/20",
    tips: [
      { label: "Title tag", detail: "Unique, descriptive title per page (50–60 chars). Put your keyword near the front." },
      { label: "Meta description", detail: "Compelling summary (150–160 chars). Doesn't rank directly, but boosts click-through rate." },
      { label: "H1 tag", detail: "One H1 per page containing your primary keyword, matching what the page is about." },
      { label: "URL structure", detail: "Keep URLs short, lowercase, hyphen-separated. e.g. /web-development-services" },
      { label: "Image alt text", detail: "Every image needs descriptive alt text — helps accessibility and image search." },
      { label: "Keyword placement", detail: "Use your keyword naturally in the first paragraph, headings, and body. Never stuff." },
    ],
  },
  {
    title: "Technical SEO",
    badge: "Must have",
    badgeClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    tips: [
      { label: "Sitemap", detail: "Generate and submit a sitemap.xml to Google Search Console.", link: "https://search.google.com/search-console" },
      { label: "robots.txt", detail: "Tell crawlers which pages to index and which to skip." },
      { label: "HTTPS", detail: "Your site must run on HTTPS. Google treats HTTP as insecure." },
      { label: "Mobile-friendly", detail: "Google uses mobile-first indexing. Test at search.google.com/test/mobile-friendly.", link: "https://search.google.com/test/mobile-friendly" },
      { label: "Page speed", detail: "Aim for LCP < 2.5s. Compress images, use WebP/AVIF, minimise JavaScript.", link: "https://pagespeed.web.dev" },
      { label: "Canonical URLs", detail: 'Add <link rel="canonical"> to every page to prevent duplicate content issues.' },
    ],
  },
  {
    title: "Structured Data",
    badge: "Rich results",
    badgeClass: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    tips: [
      { label: "Person schema", detail: "For personal brands/portfolios — add name, socials, and job title." },
      { label: "Organization schema", detail: "For businesses — add name, logo, contact, and social links." },
      { label: "WebSite schema", detail: "Enables a sitelinks search box and helps Google understand your site's identity." },
      { label: "BreadcrumbList schema", detail: "Add to inner pages to get breadcrumbs showing in search results." },
      { label: "Validate schemas", detail: "Test all structured data at the Rich Results Test before deploying.", link: "https://search.google.com/test/rich-results" },
    ],
  },
  {
    title: "Off-Page SEO",
    badge: "Authority",
    badgeClass: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    tips: [
      { label: "Backlinks", detail: "Get reputable sites to link to yours. Quality beats quantity every time." },
      { label: "Social profiles", detail: "Add your website URL to LinkedIn, GitHub, and Twitter — these are trusted backlinks." },
      { label: "Google Business Profile", detail: "Create a free profile to appear in Maps and the knowledge panel.", link: "https://business.google.com" },
      { label: 'rel="me" links', detail: 'Add <link rel="me"> in your site head pointing to your social profiles.' },
      { label: "Content sharing", detail: "Publish articles linking back to your site. LinkedIn and dev.to are great sources." },
    ],
  },
  {
    title: "Free Tools",
    badge: "Monitor",
    badgeClass: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    tips: [
      { label: "Google Search Console", detail: "Submit sitemap, monitor indexing, see which queries bring traffic.", link: "https://search.google.com/search-console" },
      { label: "PageSpeed Insights", detail: "Measures Core Web Vitals (LCP, FID, CLS) on mobile and desktop.", link: "https://pagespeed.web.dev" },
      { label: "Ahrefs Webmaster Tools", detail: "Free tier — backlinks, broken links, and basic keyword rankings.", link: "https://ahrefs.com/webmaster-tools" },
      { label: "Schema Validator", detail: "Validates all your JSON-LD structured data and flags errors.", link: "https://validator.schema.org" },
    ],
  },
];

/* ─── Component ─── */
export const SEOGuideDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-seo-guide", handleOpen);
    return () => window.removeEventListener("open-seo-guide", handleOpen);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[540px] max-h-[90vh] overflow-hidden bg-background/95 backdrop-blur-xl border-border shadow-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold">
            <TrendingUp className="h-5 w-5 text-accent" />
            SEO Guide
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            General tips or your personal ranking checklist
          </p>
        </DialogHeader>

        <Tabs defaultValue="public">
          <TabsList className="w-full">
            <TabsTrigger value="public" className="flex-1 gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" />
              SEO Tips
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex-1 gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              My Checklist
            </TabsTrigger>
          </TabsList>

          {/* ── Public tab ── */}
          <TabsContent value="public">
            <ScrollArea className="h-[58vh] pr-3">
              <div className="space-y-5 py-2">
                {sections.map((section) => (
                  <div key={section.title} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{section.title}</span>
                      <Badge variant="outline" className={`ml-auto text-xs ${section.badgeClass}`}>
                        {section.badge}
                      </Badge>
                    </div>
                    <div className="space-y-2 rounded-xl border border-border/50 bg-card/30 p-3">
                      {section.tips.map((tip) => (
                        <div key={tip.label} className="flex items-start gap-2 text-sm">
                          <div className="min-w-0 flex-1">
                            <span className="font-medium text-foreground">{tip.label}</span>
                            <span className="text-muted-foreground"> — {tip.detail}</span>
                          </div>
                          {tip.link && (
                            <a
                              href={tip.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="shrink-0 text-accent hover:text-accent/80 transition-colors mt-0.5"
                              aria-label={`Open ${tip.label}`}
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground text-center pb-1">
                  Built by{" "}
                  <a href="https://njmtech.co.za" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                    Nhlanhla Junior Malaza
                  </a>
                </p>
              </div>
            </ScrollArea>
          </TabsContent>

          {/* ── Personal tab ── */}
          <TabsContent value="personal">
            <ScrollArea className="h-[58vh] pr-3">
              <div className="space-y-5 py-2">
                {steps.map((step, i) => (
                  <div key={step.title} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="text-sm font-semibold">{step.title}</span>
                      <Badge variant="outline" className={`ml-auto text-xs ${priorityColors[step.priority]}`}>
                        {step.priority}
                      </Badge>
                    </div>
                    <div className="ml-7 space-y-1.5">
                      {step.items.map((item) => (
                        <div key={item.text} className="flex items-start gap-2 text-sm">
                          {item.done ? (
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground/40 mt-0.5 shrink-0" />
                          )}
                          <span className={item.done ? "text-muted-foreground line-through" : "text-muted-foreground"}>
                            {item.text}
                          </span>
                          {item.link && !item.done && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-auto shrink-0 text-accent hover:text-accent/80 transition-colors"
                              aria-label="Open link"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="rounded-xl border border-border bg-card/50 p-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">Expected timeline</p>
                  <p>🔍 &quot;Nhlanhla Junior Malaza&quot; → <span className="text-green-400">#1 within 1–2 weeks of indexing</span></p>
                  <p>🔍 &quot;njmtech&quot; → <span className="text-green-400">#1 within 1–2 weeks of indexing</span></p>
                  <p>🔗 Sitelinks (Projects, Contact) → <span className="text-yellow-400">2–6 weeks after indexing</span></p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
