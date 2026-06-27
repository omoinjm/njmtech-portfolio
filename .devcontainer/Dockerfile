FROM mcr.microsoft.com/devcontainers/javascript-node:24

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.15.1 --activate

WORKDIR /workspaces/njmtech-portfolio

EXPOSE 3000
