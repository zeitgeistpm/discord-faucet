#!/bin/sh

__usage="
Usage: sh ./scripts/run.sh <network>

Options for <network>:
  test        To run faucet for ZBS
  main        To run faucet for ZTG
"

if [ "$1" = "test" ] || [ "$1" = "main" ]; then
  echo "Copying database to local..."
  docker cp $1-faucet:$1-faucet.db $1-faucet.db
  echo "Removing old build..."
  docker rm -f $1-faucet
  echo "Building faucet..."
  docker build . --target $1-faucet -t $1-faucet
  echo "Starting faucet..."
  docker run -d --name=$1-faucet $1-faucet
else
  echo "$__usage"
fi