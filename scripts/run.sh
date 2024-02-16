#!/bin/sh

echo "Building main-faucet..."
docker build . --target main-faucet -t main-faucet

echo "Starting main-faucet..."
docker run -d --name=main-faucet main-faucet