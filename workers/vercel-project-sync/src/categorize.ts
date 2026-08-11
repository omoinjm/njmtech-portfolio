import type {
  CategorizationResult,
  Env,
  ProjectCategory,
  ProjectGroupRow,
  VercelProject,
} from "./types";
import { getRepoContext } from "./map-project";

const ALLOWED_CATEGORIES: ProjectCategory[] = [
  "Website",
  "Tools",
  "E-commerce",
];

const AI_MODEL = "@cf/meta/llama-3.1-8b-instruct";

function buildPrompt(project: VercelProject): string {
  const repo = getRepoContext(project);
  const framework = project.framework ?? "unknown";

  return [
    "You classify Vercel portfolio projects and write a short public description.",
    `Allowed categories only: ${ALLOWED_CATEGORIES.join(", ")}.`,
    "Return strict JSON with keys category and description.",
    'Example: {"category":"Website","description":"A Next.js portfolio site deployed on Vercel."}',
    "",
    `Project name: ${project.name}`,
    `Framework: ${framework}`,
    repo ? `Repository: ${repo}` : "Repository: not linked",
    "",
    "Rules:",
    "- category must be exactly one of the allowed values",
    "- description is one sentence, max 120 characters, no markdown",
  ].join("\n");
}

function parseAiJson(text: string): Partial<CategorizationResult> | null {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) {
    return null;
  }

  try {
    return JSON.parse(match[0]) as Partial<CategorizationResult>;
  } catch {
    return null;
  }
}

function normalizeCategory(value: unknown): ProjectCategory | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  return (
    ALLOWED_CATEGORIES.find(
      (category) => category.toLowerCase() === normalized,
    ) ?? null
  );
}

function fallbackDescription(project: VercelProject): string {
  const framework = project.framework ?? "web";
  return `A ${framework} project deployed on Vercel.`;
}

export function resolveGroupId(
  groups: ProjectGroupRow[],
  category: ProjectCategory,
): number {
  const match = groups.find(
    (group) => group.name.toLowerCase() === category.toLowerCase(),
  );

  if (match) {
    return match.id;
  }

  const websiteGroup =
    groups.find((group) => group.code === "WEB") ??
    groups.find((group) => group.name.toLowerCase() === "website");

  if (!websiteGroup) {
    throw new Error("No Website project_group row found in D1");
  }

  return websiteGroup.id;
}

export async function categorizeNewProject(
  env: Env,
  project: VercelProject,
): Promise<CategorizationResult> {
  try {
    const result = await env.AI.run(AI_MODEL, {
      messages: [{ role: "user", content: buildPrompt(project) }],
      max_tokens: 180,
      temperature: 0.2,
    });

    const text =
      typeof result === "string"
        ? result
        : typeof result === "object" &&
            result !== null &&
            "response" in result &&
            typeof (result as { response?: unknown }).response === "string"
          ? (result as { response: string }).response
          : JSON.stringify(result);

    const parsed = parseAiJson(text);
    const category = normalizeCategory(parsed?.category) ?? "Website";
    const description =
      typeof parsed?.description === "string" &&
      parsed.description.trim().length > 0
        ? parsed.description.trim().slice(0, 255)
        : fallbackDescription(project);

    return { category, description };
  } catch (error) {
    console.warn(
      `Workers AI categorization failed for ${project.id}:`,
      error instanceof Error ? error.message : error,
    );

    return {
      category: "Website",
      description: fallbackDescription(project),
    };
  }
}
