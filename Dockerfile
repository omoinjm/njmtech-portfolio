# Build Stage
FROM node:lts AS build-stage

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package files and lockfile
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY . .

# Build the Next.js application (dummy env vars for build)
ENV NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ENV EMAIL_MAIL="build@example.com"
ENV EMAIL_USER="build@example.com"
ENV EMAIL_APP_PASS="dummy"
ENV NEXT_PUBLIC_MAILCHIMP_URL=""
ENV POSTGRES_DATABASE=""
ENV POSTGRES_PASSWORD=""
ENV POSTGRES_HOST=""
ENV POSTGRES_USER=""
ENV POSTGRES_URL_NON_POOLING=""
ENV POSTGRES_URL=""

RUN pnpm build

# Production Stage
FROM node:lts AS production-stage

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy only necessary files from build stage
COPY --from=build-stage /app/package.json ./
COPY --from=build-stage /app/pnpm-lock.yaml ./
COPY --from=build-stage /app/.next ./.next
COPY --from=build-stage /app/public ./public
COPY --from=build-stage /app/next.config.js ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

EXPOSE 3000

# Start Next.js in production mode
CMD ["pnpm", "start"]
