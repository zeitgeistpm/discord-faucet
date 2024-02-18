#!/bin/sh

echo "Copying database to local..."
docker cp main-faucet:main-faucet.db main-faucet.db

echo "Removing main-faucet..."
docker rm -f main-faucet

echo "Building main-faucet..."
docker build . --target main-faucet -t main-faucet

echo "Starting main-faucet..."
docker run -d --name=main-faucet main-faucet