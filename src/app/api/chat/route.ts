import { NextRequest, NextResponse } from "next/server";
import { ChatOrchestrator } from "@/services/ai/orchestrator";
import { GitHubModelsProvider } from "@/services/ai/github-provider";
import { RuleBasedChatProvider } from "@/services/ai/rule-provider";
import { OMOI_SYSTEM_PROMPT, OMOI_FALLBACK_KNOWLEDGE } from "@/lib/ai-config";

export async function POST(request: NextRequest) {
  const githubToken = process.env.GITHUB_TOKEN;
  const { messages } = await request.json();

  // Dependency Injection: Initialize providers and orchestrator
  const providers = [];

  if (githubToken) {
    // Add GitHub models to the chain (Reordered for speed: 0-multiplier GA model first)
    const models =[
  { name: "gpt-4o", maxTokens: 1000 },
  { name: "gpt-5-mini", maxTokens: 2000 },
  { name: "gpt-5.4-mini", maxTokens: 2000 },
  { name: "claude-3-5-sonnet", maxTokens: 2000 },
];

    
    for (const model of models) {
     providers.push(
    new GitHubModelsProvider(
      githubToken,
      model.name,
      model.name,
      OMOI_SYSTEM_PROMPT,
      model.maxTokens
    )
  );
    }
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
