FROM zeitgeistpm/discord-faucet:latest
WORKDIR /discord-faucet
RUN yarn install --frozen-lockfile && yarn cache clean \
&& yarn build
