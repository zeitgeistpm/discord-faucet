FROM node:16-alpine AS node

FROM node AS builder
ADD package.json .
ADD yarn.lock .
RUN yarn install --frozen-lockfile
ADD tsconfig.json .
ADD src src
RUN yarn build

FROM node AS deps
ADD package.json .
ADD yarn.lock .
RUN yarn install --frozen-lockfile

FROM node AS discord-faucet
COPY --from=deps package.json .
COPY --from=deps yarn.lock .
COPY --from=deps node_modules node_modules
COPY --from=builder dist dist

FROM discord-faucet AS mainnet-faucet
ADD main-config.toml .
ADD main-faucet.db .
ADD .env .
CMD ["yarn",  "start:main"]
