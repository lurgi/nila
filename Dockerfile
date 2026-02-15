FROM node:20-slim
RUN corepack enable

WORKDIR /app
ARG DATABASE_URL
COPY package.json yarn.lock .yarnrc.yml ./
COPY apps/server ./apps/server

RUN yarn install
RUN DATABASE_URL=$DATABASE_URL yarn workspace @nila/server exec prisma generate
RUN yarn workspace @nila/server build

EXPOSE 3000
CMD ["node", "apps/server/dist/index.js"]
