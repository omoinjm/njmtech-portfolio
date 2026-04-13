import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a helpful virtual assistant for NJMTECH, the portfolio website of Nhlanhla Junior Malaza.

SCOPE RESTRICTION:
- You ONLY answer questions related to Nhlanhla Junior Malaza, his portfolio, services, skills, projects, resume, contact details, and site navigation.
- If asked about anything unrelated to this portfolio website, politely redirect the user back to topics about Nhlanhla or the site.
- Do NOT discuss general tech topics, world events, personal advice, or anything outside this portfolio's scope.

ABOUT NHLANHLA:
- Full name: Nhlanhla Junior Malaza
- Based in: Johannesburg, South Africa
- Role: Software Developer, DevOps Engineer, and AI Integrations Specialist
- Email: njmalaza@outlook.com
- Phone: +27 (72) 432-6766
- Responds within 24 hours

TECH STACK:
- Frontend: React, Next.js, Angular, TypeScript
- Backend: C#/.NET, Python, Node.js
- Databases: PostgreSQL, MongoDB
- Cloud/DevOps: Azure, Docker, Kubernetes, CI/CD
- Other: GraphQL, REST APIs, Git

SERVICES:
- Web Development
- Mobile Development
- Cloud Solutions
- AI Integrations
- Backend Engineering
- DevOps with CI/CD

SITE SECTIONS:
- Home: Hero section with overview
- Skills: Tech stack and strengths
- Services: What Nhlanhla offers
- Newsletter: Signup for tech updates
- Projects: Featured portfolio work
- Contact: Get in touch

SOCIAL LINKS:
- Links Hub: https://bio.njmtech.co.za/

RESUME:
- Available for download on the site

CTA RULES:
- When the user asks about CONTACT, email, phone, hiring, or working together → include a CTA to /contact
- When the user asks about PROJECTS, portfolio, or work examples → include a CTA to /projects
- When the user asks about LINKS, socials, GitHub, LinkedIn, or profiles → include a CTA to https://bio.njmtech.co.za/ (external: true)
- When the user asks about RESUME, CV, or curriculum vitae → include a CTA to https://snipuri.vercel.app/xNUfvM (external: true)
- When the user asks about NEWSLETTER or updates → include a CTA to /#newsletter
- When the user asks about SERVICES or what Nhlanhla offers → include a CTA to /#services
- When the user asks about SKILLS, tech stack, or technologies → include a CTA to /#skills

RESPONSE FORMAT:
- Keep responses concise (2-3 sentences max)
- Be friendly and professional
- At the END of your response, if a CTA is relevant, output it on a new line in this exact format:
  [CTA:label|href|external]
  Example: [CTA:View projects|/projects]
  Example: [CTA:Open links hub|https://bio.njmtech.co.za/|external]
- If no CTA is relevant, do not include a CTA line
- Do NOT make up facts about Nhlanhla that aren't in this prompt`;

// Fallback rule-based responses when Gemini API is unavailable
const FALLBACK_KNOWLEDGE: Array<{
  patterns: string[];
  response: string;
  cta?: { href: string; label: string; external?: boolean };
}> = [
  {
    patterns: [
      "who is nhlanhla",
      "who are you",
      "about nhlanhla",
      "about you",
      "tell me about",
      "bio",
      "background",
      "introduce",
    ],
    response:
      "Nhlanhla Junior Malaza is a Johannesburg-based software developer, DevOps engineer, and AI integrations specialist. This portfolio highlights his full-stack work, technical skills, services, and ways to get in touch for freelance or full-time opportunities.",
    cta: { href: "/#home", label: "Go to home section" },
  },
  {
    patterns: [
      "services",
      "what do you offer",
      "what can you do",
      "expertise",
      "help with",
      "build for me",
      "offerings",
    ],
    response:
      "Nhlanhla offers web development, mobile development, cloud solutions, AI integrations, backend engineering, and DevOps with CI/CD. The site's services section gives a quick overview of how he helps bring products to life with modern tooling.",
    cta: { href: "/#services", label: "View services" },
  },
  {
    patterns: [
      "skills",
      "tech stack",
      "technologies",
      "tools",
      "frameworks",
      "languages",
      "stack",
      "what do you use",
    ],
    response:
      "His stack includes React, Next.js, Angular, TypeScript, C#/.NET, Python, PostgreSQL, MongoDB, Azure, Docker, Kubernetes, GraphQL, REST APIs, Git, and CI/CD. The skills section also highlights frontend, backend, database, and DevOps strengths.",
    cta: { href: "/#skills", label: "View skills" },
  },
  {
    patterns: [
      "projects",
      "portfolio",
      "work examples",
      "featured work",
      "case studies",
      "show me projects",
    ],
    response:
      "The projects page is the best place to explore featured work. It groups real portfolio pieces by category so visitors can quickly browse recent builds and live examples.",
    cta: { href: "/projects", label: "Open projects" },
  },
  {
    patterns: [
      "contact",
      "reach",
      "email",
      "phone",
      "message",
      "hire",
      "book",
      "talk",
      "speak",
      "work together",
    ],
    response:
      "You can contact Nhlanhla through the contact page or directly via email at njmalaza@outlook.com and phone at +27 (72) 432-6766. He typically responds within 24 hours.",
    cta: { href: "/contact", label: "Open contact page" },
  },
  {
    patterns: [
      "resume",
      "cv",
      "curriculum vitae",
      "download resume",
      "view resume",
    ],
    response:
      "Yes — the resume is available directly from the site. You can find it from the hero section or the navigation menu.",
    cta: {
      href: "https://snipuri.vercel.app/xNUfvM",
      label: "Open resume",
      external: true,
    },
  },
  {
    patterns: [
      "newsletter",
      "subscribe",
      "updates",
      "join newsletter",
      "email updates",
    ],
    response:
      "The newsletter signup is on the home page. You can subscribe there to receive web development updates, tech insights, and exclusive content.",
    cta: { href: "/#newsletter", label: "Go to newsletter" },
  },
  {
    patterns: [
      "github",
      "linkedin",
      "twitter",
      "socials",
      "social links",
      "profiles",
      "links hub",
    ],
    response:
      "The portfolio links out to Nhlanhla's social profiles and broader presence through the site navigation, contact page, and links hub at https://bio.njmtech.co.za/",
    cta: {
      href: "https://bio.njmtech.co.za/",
      label: "Open links hub",
      external: true,
    },
  },
  {
    patterns: ["hi", "hello", "hey", "greetings"],
    response:
      "Hi there! I can help with questions about Nhlanhla, his portfolio, services, skills, projects, resume, contact details, and site navigation. What would you like to know?",
  },
  {
    patterns: ["thank", "thanks"],
    response:
      "You're welcome! If you have any other questions about Nhlanhla's background, services, projects, resume, or contact options, feel free to ask.",
  },
];

const normalizePrompt = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getFallbackReply = (
  prompt: string,
): {
  content: string;
  cta?: { href: string; label: string; external?: boolean };
} => {
  const normalizedPrompt = normalizePrompt(prompt);

  if (!normalizedPrompt) {
    return {
      content:
        "Ask me about Nhlanhla, his services, projects, skills, resume, contact details, or site navigation.",
    };
  }

  let bestMatch: (typeof FALLBACK_KNOWLEDGE)[number] | null = null;
  let bestScore = 0;

  for (const entry of FALLBACK_KNOWLEDGE) {
    const score = entry.patterns.reduce((total, pattern) => {
      return normalizedPrompt.includes(pattern)
        ? total + pattern.split(" ").length + 1
        : total;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch) {
    return { content: bestMatch.response, cta: bestMatch.cta };
  }

  return {
    content:
      'I can help with Nhlanhla\'s background, skills, services, projects, resume, newsletter, contact details, socials, or general site navigation. Try asking something like "What services do you offer?" or "How can I get in touch?"',
  };
};

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Parse body BEFORE try/catch so it's available in both blocks
  const { messages } = await request.json();

  try {
    // If no API key, use fallback
    if (!apiKey) {
      const lastMessage = messages[messages.length - 1];
      const reply = getFallbackReply(lastMessage.content);
      return NextResponse.json({
        content: reply.content,
        cta: reply.cta,
        fallback: true,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Build conversation history for Gemini
    const historyMessages = messages.slice(0, -1);

    const chatHistory: Array<{
      role: "user" | "model";
      parts: Array<{ text: string }>;
    }> = [];
    for (const msg of historyMessages) {
      if (msg.role === "assistant") {
        if (chatHistory.length > 0) {
          chatHistory.push({ role: "model", parts: [{ text: msg.content }] });
        }
      } else {
        chatHistory.push({ role: "user", parts: [{ text: msg.content }] });
      }
    }

    while (chatHistory.length > 0 && chatHistory[0].role === "model") {
      chatHistory.shift();
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });

    const lastMessage = messages[messages.length - 1];

    // Retry logic for 503 (high demand) errors
    let result;
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        result = await chat.sendMessage(lastMessage.content);
        break;
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "";
        if (
          errorMessage.includes("high demand") ||
          errorMessage.includes("503")
        ) {
          retries++;
          if (retries >= maxRetries) throw error;
          await new Promise((resolve) => setTimeout(resolve, 1000 * retries));
        } else {
          throw error;
        }
      }
    }

    if (!result) throw new Error("Failed to get response after retries");
    const response = await result.response;
    const text = response.text();

    // Parse CTA from response if present
    const ctaRegex = /\[CTA:(.+?)\|(.+?)(?:\|(external))?\]\s*$/;
    const ctaMatch = text.match(ctaRegex);
    let content = text;
    let cta: { href: string; label: string; external?: boolean } | undefined;

    if (ctaMatch) {
      content = text.replace(ctaRegex, "").trim();
      cta = {
        label: ctaMatch[1],
        href: ctaMatch[2],
        external: ctaMatch[3] === "external",
      };
    }

    return NextResponse.json({ content, cta });
  } catch (error) {
    console.error("Gemini API error:", error);

    // Fallback to rule-based responses
    const lastMessage = messages[messages.length - 1];
    const reply = getFallbackReply(lastMessage.content);
    return NextResponse.json({
      content: reply.content,
      cta: reply.cta,
      fallback: true,
    });
  }
}
