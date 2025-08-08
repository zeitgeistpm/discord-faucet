#!/bin/sh

__usage="
Usage: sh ./scripts/run.sh <network>

Options for <network>:
  test        To run faucet for ZBS
  main        To run faucet for ZTG
"

if [ "$1" = "test" ] || [ "$1" = "main" ]; then
  echo "Copying database to local (if exists)..."
  docker cp $1-faucet:$1-faucet.db $1-faucet.db 2>/dev/null || echo "No existing database found, will create new one"
  
  echo "Removing old container..."
  docker rm -f $1-faucet 2>/dev/null || echo "No existing container to remove"
  
  echo "Building $1 faucet..."
  docker build . --target $1-faucet -t $1-faucet
  
  echo "Starting $1 faucet..."
  docker run -d --name=$1-faucet $1-faucet
    
  echo "✅ $1 faucet started successfully!"
  echo "📊 Check logs with: docker logs -f $1-faucet"
else
  echo "$__usage"
fi