FROM node:22-alpine AS build

WORKDIR /app

ARG GITHUB_PACKAGES_TOKEN
ENV GITHUB_PACKAGES_TOKEN=${GITHUB_PACKAGES_TOKEN}

COPY package.json yarn.lock .npmrc ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Copy non-TS assets that tsc doesn't emit (email templates)
RUN mkdir -p build/services/email && cp -r src/services/email/templates build/services/email/templates

FROM node:22-alpine

ENV NODE_ENV=production

WORKDIR /app

ARG GITHUB_PACKAGES_TOKEN
ENV GITHUB_PACKAGES_TOKEN=${GITHUB_PACKAGES_TOKEN}

COPY package.json yarn.lock .npmrc ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

ENV GITHUB_PACKAGES_TOKEN=

COPY --from=build /app/build ./build

EXPOSE 16006

CMD ["node", "build/server.js"]
