FROM node:14-alpine 
RUN mkdir -p /home/discord-faucet && chown -R node:node /home/discord-faucet
WORKDIR /home/discord-faucet
COPY data_final.csv .
COPY package.json .
COPY yarn.lock .
COPY tsconfig.json .
COPY src src
RUN yarn install --frozen-lockfile && yarn cache clean \
&& yarn build
CMD ["yarn", "start"]