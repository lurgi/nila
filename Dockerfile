FROM node:20-slim

RUN corepack enable
WORKDIR /app

ARG DATABASE_URL
ENV NODE_ENV=production

# Copy workspace manifests first for better Docker layer caching.
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/server/package.json ./apps/server/package.json
COPY packages/types/package.json ./packages/types/package.json

RUN yarn install --immutable

# Copy source after dependency install.
COPY apps/server ./apps/server
COPY packages/types ./packages/types

# Build shared workspace package before server build.
RUN yarn workspace @nila/types build
RUN DATABASE_URL=$DATABASE_URL yarn workspace @nila/server exec prisma generate
RUN yarn workspace @nila/server build

# Run as non-root user.
USER node

EXPOSE 3000
CMD ["node", "apps/server/dist/index.js"]
