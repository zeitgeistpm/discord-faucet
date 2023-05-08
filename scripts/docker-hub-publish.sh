#!/usr/bin/env bash

VERSION=$1

if [[ -z "$1" ]] ; then
    echo "Usage: ./scripts/docker-hub-publish.sh VERSION"
    exit 1
fi

docker build ./base -t zeitgeistpm/discord-faucet:$1 -t zeitgeistpm/discord-faucet:latest
docker push zeitgeistpm/discord-faucet:$1
docker push zeitgeistpm/discord-faucet:latest