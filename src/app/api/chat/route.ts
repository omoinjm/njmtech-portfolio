import { NextRequest, NextResponse } from "next/server";
import { ChatOrchestrator } from "@/services/ai/orchestrator";
import { WorkersAIProvider } from "@/services/ai/workers-ai-provider";
import { RuleBasedChatProvider } from "@/services/ai/rule-provider";
import { OMOI_SYSTEM_PROMPT, OMOI_FALLBACK_KNOWLEDGE } from "@/lib/ai-config";
import { verifyTurnstile } from "@/lib/turnstile";

const WORKERS_AI_MODEL = "@cf/meta/llama-3.1-8b-instruct";

export async function POST(request: NextRequest) {
  const cloudflareToken = process.env.CLOUDFLARE_API_TOKEN;
  const cloudflareAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const { messages, turnstileToken } = await request.json();

  const remoteip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const turnstileOk = await verifyTurnstile(turnstileToken, "chat", remoteip);
  if (!turnstileOk) {
    return NextResponse.json(
      { content: "Verification failed. Please refresh and try again.", fallback: true },
      { status: 403 }
    );
  }

  // Dependency Injection: Initialize providers and orchestrator
  const providers = [];

  if (cloudflareToken && cloudflareAccountId) {
    providers.push(
      new WorkersAIProvider(
        cloudflareToken,
        cloudflareAccountId,
        WORKERS_AI_MODEL,
        WORKERS_AI_MODEL,
        OMOI_SYSTEM_PROMPT,
        1000
      )
    );
  }

  // Always add the rule-based fallback at the end of the chain
  providers.push(new RuleBasedChatProvider(OMOI_FALLBACK_KNOWLEDGE));

  const orchestrator = new ChatOrchestrator(providers);

  try {
    const response = await orchestrator.getResponse(messages);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API orchestration critical failure:", error);
    return NextResponse.json(
      { 
        content: "I'm having a total meltdown... literally. Something went wrong on the server. Please try again later!",
        fallback: true 
      }, 
      { status: 500 }
    );
  }
}
