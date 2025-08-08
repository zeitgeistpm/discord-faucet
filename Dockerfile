FROM node:18-alpine AS node

FROM node AS builder
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable
COPY tsconfig.json ./
COPY src ./src
RUN yarn build

FROM node AS deps
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

FROM node:18-alpine AS faucet
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/package.json /app/yarn.lock /app/.yarnrc.yml ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

FROM faucet AS test-faucet
COPY test-config.toml ./
COPY .env ./
# Create empty db file if it doesn't exist
RUN touch test-faucet.db
CMD ["yarn", "start:test"]

FROM faucet AS main-faucet
COPY main-config.toml ./
COPY .env ./
# Create empty db file if it doesn't exist  
RUN touch main-faucet.db
CMD ["yarn", "start:main"]