# NJMTECH Portfolio - Gemini CLI Context

This project is a modern, high-performance portfolio website built with **Next.js 16**, **React 18**, and **TypeScript**. It features immersive 3D scenes using **Three.js** and a robust backend integrated with **Neon PostgreSQL**.

## Project Overview

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui + Framer Motion
- **Database**: PostgreSQL (Neon) via `@neondatabase/serverless`
- **Secrets Management**: Infisical
- **3D Graphics**: Three.js (React Three Fiber)
- **State/Data**: TanStack React Query + custom `DataService`
- **Forms**: React Hook Form + Zod
- **Email**: Nodemailer (contact form)
- **Testing**: Playwright (E2E)

## Building and Running

### Prerequisites
- **Node.js**: 24.x (as per `package.json`)
- **Package Manager**: `pnpm`
- **Infisical CLI**: Required for environment variable injection.

### Key Commands
- `pnpm dev`: Starts development server with Turbopack and Infisical-injected env vars.
- `pnpm dev:local`: Starts development server without Infisical (uses `.env.local`).
- `pnpm build`: Standard Next.js build.
- `pnpm build:prod`: Production build with Infisical env vars.
- `pnpm start`: Starts production server with Infisical.
- `pnpm test`: Runs Playwright E2E tests.
- `pnpm lint`: Runs ESLint.
- `pnpm ai_cache`: Generates voice cache for AI features.

## Architecture

### Configuration
Environment variables are managed in `src/lib/config.ts` using **Zod** for runtime validation and type safety. **Always** use the `config` service instead of `process.env` directly.

### Data Management
- **`src/services/data.service.ts`**: Client-side wrapper for API calls.
- **`src/services/sql.service.ts`**: Server-side service for interacting with the database. Includes automatic table creation and seeding logic via `src/lib/seed.ts`.
- **API Routes**: Located in `src/app/api/`, handling chat, contact, projects, skills, and more.

### UI & Styling
- **shadcn/ui**: Base components are in `src/components/ui/`.
- **Tailwind CSS**: Global styles and utilities are in `src/index.css`.
- **Layout**: The main layout is defined in `src/components/layout/Layout.tsx`, wrapped by `Providers` in `src/app/providers.tsx`.

## Development Conventions

1.  **Strict Typing**: Always use TypeScript. Avoid `any` at all costs.
2.  **Environment Variables**: Define new variables in `.env.example` and add them to the Zod schema in `src/lib/config.ts`.
3.  **Components**:
    - Use `shadcn/ui` for primitive components.
    - Organize feature-specific components in `src/components/[feature]/`.
4.  **API Interaction**:
    - Use `DataService.get_call` or `DataService.post_call` for client-side fetching.
    - Use `sql.service.ts` for direct database access in server components or API routes.
5.  **3D Scenes**: Three.js scenes are located in `src/components/home/`. Be mindful of performance when editing these.
6.  **Logging**: Use the custom logger in `src/utils/logger.ts` instead of `console.log`.
7.  **Commits**: Follow the project's existing commit style (concise and meaningful).

## Key Files for Reference
- `package.json`: Dependency and script source of truth.
- `src/lib/config.ts`: Environment variable schema.
- `src/services/sql.service.ts`: Core database logic.
- `src/index.css`: Tailwind configuration and custom utility classes.
- `src/app/api/`: Backend implementation details.
