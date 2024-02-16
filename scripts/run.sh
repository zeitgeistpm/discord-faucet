#!/bin/sh

echo "Building mainnet-faucet..."
docker build . --target mainnet-faucet -t mainnet-faucet

echo "Starting mainnet-faucet..."
docker run -d --name=mainnet-faucet mainnet-faucet