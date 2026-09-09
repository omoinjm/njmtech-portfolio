/**
 * One-time seed: pushes the current site copy into Sanity as the initial
 * heroContent / founder / aboutContent / ecosystemDivision documents.
 *
 * Uses createIfNotExists so it's safe to re-run — it will never overwrite
 * content someone has already edited in the Studio.
 *
 * Usage: pnpm sanity:seed
 */
import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / SANITY_API_WRITE_TOKEN. Run `vercel env pull .env.local` first.",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

async function seed() {
  await client.createIfNotExists({
    _id: "heroContent",
    _type: "heroContent",
    welcomeBadge: {
      en: "Johannesburg · Taking new clients",
      zu: "EJohannesburg · Ngamukela amaklayenti amasha",
    },
    headline: {
      en: "Engineered Solutions for the Digital & Physical Frontier.",
      zu: "Engineered Solutions for the Digital & Physical Frontier.",
    },
    subtitle: {
      en: "I'm Nhlanhla Junior Malaza, Founder & Lead Engineer at Open Akha Studio (an Open Akha Labs company). I build high-performance web applications, custom digital tools, and scalable software systems.",
      zu: "I'm Nhlanhla Junior Malaza, Founder & Lead Engineer at Open Akha Studio (an Open Akha Labs company). I build high-performance web applications, custom digital tools, and scalable software systems.",
    },
  });
  console.log("✓ heroContent");

  await client.createIfNotExists({
    _id: "founder",
    _type: "founder",
    bio: {
      en: "Founded by Nhlanhla Junior Malaza — full-stack developer and DevOps engineer based in Johannesburg. NJMTECH is the studio behind production-ready sites for SMEs, professionals, and growing brands across South Africa.",
      zu: "Founded by Nhlanhla Junior Malaza — full-stack developer and DevOps engineer based in Johannesburg. NJMTECH is the studio behind production-ready sites for SMEs, professionals, and growing brands across South Africa.",
    },
    extendedRole: {
      en: "Beyond njmtech, Nhlanhla Junior Malaza is Founder & Lead Engineer at Open Akha Studio, an Open Akha Labs company.",
      zu: "Beyond njmtech, Nhlanhla Junior Malaza is Founder & Lead Engineer at Open Akha Studio, an Open Akha Labs company.",
    },
  });
  console.log("✓ founder");

  await client.createIfNotExists({
    _id: "aboutContent",
    _type: "aboutContent",
    companyParagraphs: {
      en: [
        "NJMTECH helps South African businesses get online with websites, hosting, and digital tools that actually drive enquiries — not just look pretty.",
        "We combine modern web development (Next.js, Cloudflare, AI integrations) with practical business focus: fast delivery, transparent pricing, and support you can reach on WhatsApp.",
      ],
      zu: [
        "NJMTECH helps South African businesses get online with websites, hosting, and digital tools that actually drive enquiries — not just look pretty.",
        "We combine modern web development (Next.js, Cloudflare, AI integrations) with practical business focus: fast delivery, transparent pricing, and support you can reach on WhatsApp.",
      ],
    },
    values: {
      en: [
        "Clear pricing before we start — no surprise invoices",
        "Mobile-first builds that load fast on South African networks",
        "Direct communication — you talk to the person building your site",
        "Launch support included so you're not left figuring it out alone",
      ],
      zu: [
        "Clear pricing before we start — no surprise invoices",
        "Mobile-first builds that load fast on South African networks",
        "Direct communication — you talk to the person building your site",
        "Launch support included so you're not left figuring it out alone",
      ],
    },
    clientIndustries: {
      en: ["Retail", "Real Estate", "Professional Services", "Hospitality", "Education", "Non-profit"],
      zu: ["Retail", "Real Estate", "Professional Services", "Hospitality", "Education", "Non-profit"],
    },
  });
  console.log("✓ aboutContent");

  const divisions = [
    {
      _id: "ecosystemDivision-open-studio",
      key: "open-studio",
      name: "Open Akha Studio",
      tagline: {
        en: "Enterprise Web Architecture, Custom Web Apps & Mobile Platforms.",
        zu: "Enterprise Web Architecture, Custom Web Apps & Mobile Platforms.",
      },
      statusLabel: null,
      url: "#",
      order: 1,
    },
    {
      _id: "ecosystemDivision-open-intelligence",
      key: "open-intelligence",
      name: "Open Akha Intelligence",
      tagline: {
        en: "AI Workflows, Autonomous Agents & Custom Tooling.",
        zu: "AI Workflows, Autonomous Agents & Custom Tooling.",
      },
      statusLabel: { en: "In Development", zu: "In Development" },
      url: null,
      order: 2,
    },
    {
      _id: "ecosystemDivision-open-dynamics",
      key: "open-dynamics",
      name: "Open Akha Dynamics",
      tagline: {
        en: "Physical Automation, IoT & Robotics R&D.",
        zu: "Physical Automation, IoT & Robotics R&D.",
      },
      statusLabel: { en: "Future Division", zu: "Future Division" },
      url: null,
      order: 3,
    },
  ];

  for (const division of divisions) {
    await client.createIfNotExists({ ...division, _type: "ecosystemDivision" });
    console.log(`✓ ecosystemDivision (${division.key})`);
  }

  console.log("\nSeed complete. Existing documents were left untouched.");
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
