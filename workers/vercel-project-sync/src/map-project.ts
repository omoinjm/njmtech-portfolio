import type { MappedProjectFields, VercelProject } from "./types";

const FRAMEWORK_LABELS: Record<string, string> = {
  nextjs: "Next.js",
  nuxtjs: "Nuxt.js",
  gatsby: "Gatsby",
  remix: "Remix",
  vite: "Vite",
  vue: "Vue",
  svelte: "Svelte",
  sveltekit: "SvelteKit",
  "sveltekit-1": "SvelteKit",
  astro: "Astro",
  angular: "Angular",
  express: "Express",
  fastapi: "FastAPI",
  flask: "Flask",
  django: "Django",
  hono: "Hono",
  node: "Node.js",
  python: "Python",
  rust: "Rust",
  go: "Go",
};

function humanizeProjectName(name: string): string {
  return name
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
}

function frameworkToStack(framework: string | null | undefined): string[] {
  if (!framework) {
    return ["Vercel"];
  }

  const label = FRAMEWORK_LABELS[framework] ?? framework;
  return [label, "Vercel"];
}

export function resolveLiveUrl(project: VercelProject): string {
  const productionDeployment = project.latestDeployments?.find(
    (deployment) => deployment.target === "production" && deployment.url,
  );

  if (productionDeployment?.url) {
    return productionDeployment.url.startsWith("http")
      ? productionDeployment.url
      : `https://${productionDeployment.url}`;
  }

  const anyDeployment = project.latestDeployments?.find(
    (deployment) => deployment.url,
  );

  if (anyDeployment?.url) {
    return anyDeployment.url.startsWith("http")
      ? anyDeployment.url
      : `https://${anyDeployment.url}`;
  }

  return `https://${project.name}.vercel.app`;
}

export function resolveIsCurrentDomain(
  liveUrl: string,
  siteUrl: string,
): number {
  try {
    const liveHost = new URL(liveUrl).hostname.replace(/^www\./, "");
    const siteHost = new URL(siteUrl).hostname.replace(/^www\./, "");
    return liveHost === siteHost ? 1 : 0;
  } catch {
    return 0;
  }
}

export function mapVercelProject(
  project: VercelProject,
  siteUrl: string,
  description: string,
): MappedProjectFields {
  const liveUrl = resolveLiveUrl(project);

  return {
    title: humanizeProjectName(project.name),
    description,
    liveUrl,
    stackJson: JSON.stringify(frameworkToStack(project.framework)),
    isCurrentDomain: resolveIsCurrentDomain(liveUrl, siteUrl),
  };
}

export function getRepoContext(project: VercelProject): string | undefined {
  const link = project.link;
  if (!link?.repo) {
    return undefined;
  }

  if (link.repoOwner) {
    return `${link.repoOwner}/${link.repo}`;
  }

  return link.repo;
}
