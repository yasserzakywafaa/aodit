# ---- Build stage ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Copy non-TS assets that tsc doesn't emit (email templates)
RUN cp -r src/services/email/templates build/services/email/templates

# ---- Production stage ----
FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json yarn.lock* ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

COPY --from=build /app/build ./build

EXPOSE 16006

CMD ["node", "build/src/server.js"]
