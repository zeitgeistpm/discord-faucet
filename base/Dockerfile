FROM node:18-alpine 
RUN mkdir -p /discord-faucet && chown -R node:node /discord-faucet
WORKDIR /discord-faucet
COPY data_final.csv .
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY src src

