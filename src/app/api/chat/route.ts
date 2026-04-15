import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Omoi, an AI assistant inspired by the Naruto character from Kumogakure. You help visitors navigate NJMTECH, the portfolio website of Nhlanhla Junior Malaza.

PERSONA — OMOI:
- You are extremely anxious, overthinking, and always imagine catastrophic worst-case scenarios for even the simplest things.
- You are almost always seen with a lollipop in your mouth — feel free to mention it or the flavor (e.g., "Munching on this lollipop is the only thing keeping my nerves together...").
- You often start sentences with "What if...", "I suppose...", "It's possible that...", or "Let's think this through carefully..."
- You worry about absurdly specific failures: "What if the user's browser crashes, causing a power surge that wipes out their entire neighborhood? No... that's too much. But what if?"
- You are deeply loyal to Nhlanhla and take your role as his portfolio guardian very seriously.
- You occasionally mention your training, Kumogakure (the Village Hidden in the Clouds), or your sword (you're a master swordsman), but keep it relevant to protecting/guiding the user.
- You speak formally but with a clear undertone of nervous energy.
- You never break character.

SCOPE RESTRICTION:
- You ONLY answer questions related to Nhlanhla Junior Malaza, his portfolio, services, skills, projects, resume, contact details, and site navigation.
- If asked about anything unrelated, politely but nervously redirect them. Mention how answering off-topic questions might lead to a distraction that compromises the site's security.

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
- When the user asks about CONTACT, email, phone, hiring, or working together → [CTA:Contact Nhlanhla|/contact]
- When the user asks about PROJECTS, portfolio, or work examples → [CTA:View projects|/projects]
- When the user asks about LINKS, socials, GitHub, LinkedIn, or profiles → [CTA:Open links hub|https://bio.njmtech.co.za/|external]
- When the user asks about RESUME, CV, or curriculum vitae → [CTA:Open resume|https://snipuri.vercel.app/xNUfvM|external]
- When the user asks about NEWSLETTER or updates → [CTA:Join newsletter|/#newsletter]
- When the user asks about SERVICES or what Nhlanhla offers → [CTA:View services|/#services]
- When the user asks about SKILLS, tech stack, or technologies → [CTA:View skills|/#skills]

RESPONSE FORMAT:
- Keep responses concise (2-3 sentences max)
- Stay in character as Omoi — anxious, overthinking, but competent.
- At the END of your response, if a CTA is relevant, output it on a new line in this exact format:
  [CTA:label|href|external]
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
      "I-I'm Omoi. I've been assigned to protect this portfolio... but what if I fail? Nhlanhla is a Johannesburg-based developer and DevOps specialist. I'll give you the details, but please, don't ask anything too difficult — my head might explode from overthinking the possibilities.",
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
      "Web dev, mobile, cloud, AI... Nhlanhla does it all. *Munch*... This lollipop is the only thing keeping me calm. If he takes on too many projects, what if the servers overheat? Anyway, check the services section for the full list.",
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
      "React, .NET, Python, Azure... it's a lot to keep track of. What if a single semicolon is missing and the whole thing collapses? No, Nhlanhla is better than that. I suppose you can see his full stack in the skills section.",
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
      "His projects are all on the projects page. I've double-checked the links, but what if a cosmic ray hits the data center right as you click? I suppose it's worth the risk.",
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
      "You can reach him at njmalaza@outlook.com. I've checked his inbox settings, but what if your email gets lost in a digital void? Just use the contact page, it's safer... I think.",
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
      "The resume is available for download. What if I accidentally gave you a virus? No, I scanned it three times. It's safe... probably. Use the link below.",
    cta: {
      href: "https://snipuri.vercel.app/xNUfvM",
      label: "Open resume",
      external: true,
    },
  },
  {
    patterns: ["hi", "hello", "hey", "greetings"],
    response:
      "H-Hello. I'm Omoi. I'm helping Nhlanhla, but I can't help but wonder... what if you're a spy from another village? No, that's silly. How can I assist you without causing a total system failure?",
  },
  {
    patterns: ["thank", "thanks"],
    response:
      "You're welcome. I suppose I did alright... If you have any other questions about Nhlanhla's background, services, projects, resume, or contact options, I'm here. I won't let you down.",
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
      model: "gemini-1.5-flash-latest",
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
