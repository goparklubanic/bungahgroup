FROM node:20-bookworm-slim AS deps

RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
ENV npm_config_build_from_source=true
RUN npm ci --omit=dev \
    && npm rebuild sqlite3 --build-from-source

FROM node:20-bookworm-slim

WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p /app/db

EXPOSE 3001
CMD ["node", "server.js"]
