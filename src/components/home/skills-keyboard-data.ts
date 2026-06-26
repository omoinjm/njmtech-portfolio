export type SkillCategory = "frontend" | "backend" | "devops" | "database";

export type KeyboardSkill = {
  id: string;
  label: string;
  iconSrc: string;
  category: SkillCategory;
  summary: string;
};

export const SKILL_CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  devops: "DevOps",
  database: "Database",
};

export const KEYBOARD_SKILLS: KeyboardSkill[][] = [
  [
    {
      id: "react",
      label: "React",
      iconSrc: "/tech-icons/react.svg",
      category: "frontend",
      summary: "Component-driven interfaces, reusable UI patterns, and polished product flows.",
    },
    {
      id: "nextjs",
      label: "Next.js",
      iconSrc: "/tech-icons/nextjs.svg",
      category: "frontend",
      summary: "App Router builds, SEO-aware pages, and production-ready full-stack web delivery.",
    },
    {
      id: "typescript",
      label: "TypeScript",
      iconSrc: "/tech-icons/typescript.svg",
      category: "frontend",
      summary: "Strict typing across the UI and APIs to keep features safer as the codebase grows.",
    },
    {
      id: "angular",
      label: "Angular",
      iconSrc: "/tech-icons/angular.svg",
      category: "frontend",
      summary: "Structured enterprise frontends with strong patterns for scale and maintainability.",
    },
    {
      id: "graphql",
      label: "GraphQL",
      iconSrc: "/tech-icons/graphql.svg",
      category: "backend",
      summary: "Flexible data contracts for apps that need efficient, targeted client queries.",
    },
  ],
  [
    {
      id: "nodejs",
      label: "Node.js",
      iconSrc: "/tech-icons/nodejs.svg",
      category: "backend",
      summary: "API and automation services built around fast iteration and dependable integrations.",
    },
    {
      id: "csharp",
      label: "C#",
      iconSrc: "/tech-icons/csharp.svg",
      category: "backend",
      summary: "Business logic and service development for robust enterprise-focused applications.",
    },
    {
      id: "python",
      label: "Python",
      iconSrc: "/tech-icons/python.svg",
      category: "backend",
      summary: "Automation, AI workflows, and backend problem-solving where speed and clarity matter.",
    },
    {
      id: "postgresql",
      label: "PostgreSQL",
      iconSrc: "/tech-icons/postgresql.svg",
      category: "database",
      summary: "Relational data modeling, performant queries, and dependable production persistence.",
    },
    {
      id: "mongodb",
      label: "MongoDB",
      iconSrc: "/tech-icons/mongodb.svg",
      category: "database",
      summary: "Document-centric storage for flexible schemas and iteration-heavy product work.",
    },
  ],
  [
    {
      id: "docker",
      label: "Docker",
      iconSrc: "/tech-icons/docker.svg",
      category: "devops",
      summary: "Portable environments that keep local development, CI, and deployment aligned.",
    },
    {
      id: "kubernetes",
      label: "Kubernetes",
      iconSrc: "/tech-icons/kubernetes.svg",
      category: "devops",
      summary: "Container orchestration patterns for scalable services and resilient delivery pipelines.",
    },
    {
      id: "azure",
      label: "Azure",
      iconSrc: "/tech-icons/azure.svg",
      category: "devops",
      summary: "Cloud infrastructure, hosting, and integration services tuned for production workloads.",
    },
    {
      id: "redis",
      label: "Redis",
      iconSrc: "/tech-icons/redis.svg",
      category: "database",
      summary: "Fast caching and transient data flows for responsive, high-throughput experiences.",
    },
    {
      id: "cicd",
      label: "CI/CD",
      iconSrc: "/tech-icons/github.svg",
      category: "devops",
      summary: "Automated delivery pipelines that shorten feedback loops and reduce deployment friction.",
    },
  ],
];
