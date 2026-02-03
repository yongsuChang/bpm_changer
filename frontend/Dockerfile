FROM node:20-slim

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install

COPY . .

CMD ["pnpm", "dev", "--host"]
