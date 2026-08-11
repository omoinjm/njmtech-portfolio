export interface Env {
  DB: D1Database;
  AI: Ai;
  VERCEL_TOKEN: string;
  /** Optional — when set, team/slug projects are merged with personal-account projects. */
  VERCEL_TEAM_ID?: string;
  CRON_SECRET?: string;
  SITE_URL: string;
}

export type ProjectCategory = "Website" | "Tools" | "E-commerce";

export interface ProjectGroupRow {
  id: number;
  name: string;
  code: string;
}

export interface ExistingProjectRow {
  id: number;
  project_group_id: number;
  description: string;
  is_code: number;
  code_url: string | null;
  img_url: string | null;
  is_active: number;
}

export interface VercelDeployment {
  url?: string;
  target?: string | null;
}

export interface VercelProjectLink {
  type?: string;
  repo?: string;
  repoOwner?: string;
}

export interface VercelProject {
  id: string;
  name: string;
  framework?: string | null;
  link?: VercelProjectLink | null;
  latestDeployments?: VercelDeployment[];
}

export interface VercelProjectsResponse {
  projects: VercelProject[];
  pagination?: {
    count?: number;
    next?: number | string | null;
  };
}

export interface MappedProjectFields {
  title: string;
  description: string;
  liveUrl: string;
  stackJson: string;
  isCurrentDomain: number;
}

export interface CategorizationResult {
  category: ProjectCategory;
  description: string;
}

export interface SyncSummary {
  fetched: number;
  inserted: number;
  linked: number;
  reactivated: number;
  skipped: number;
  deactivated: number;
  /** @deprecated Always 0 — existing rows are no longer refreshed each run. */
  updated: number;
  /** Per-scope Vercel API counts (personal vs team) for debugging. */
  scopes?: Array<{ scope: string; count: number; pages: number }>;
  errors: string[];
}
