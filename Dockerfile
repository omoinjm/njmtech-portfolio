# syntax=docker/dockerfile:1

FROM node:24-bookworm AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS development
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev:local"]

FROM base AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .

# Dummy build-time env vars — override at runtime for real deployments
ENV NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ENV EMAIL_MAIL="build@example.com"
ENV EMAIL_USER="build@example.com"
ENV EMAIL_APP_PASS="dummy"
ENV NEXT_PUBLIC_MAILCHIMP_URL=""
ENV D1_ACCOUNT_ID=""
ENV D1_DATABASE_ID=""
ENV D1_API_TOKEN=""

RUN pnpm build

FROM base AS production
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.js ./
EXPOSE 3000
CMD ["pnpm", "start:local"]
