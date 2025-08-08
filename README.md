# Discord Faucet

A Discord bot for distributing Zeitgeist tokens (ZBS on testnet) to users.

## Local Development Setup

1. Install dependencies:
```bash
yarn install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your Discord bot token and wallet seed
```

3. Update `test-config.toml` with your Discord channel ID and bot token

4. Run locally:
```bash
yarn start:test
```

## Production Deployment (Testnet)

Deploy using the provided script:

```bash
sh ./scripts/run.sh test
```

This will:
- Copy any existing database to preserve rate limiting data
- Remove old containers
- Build the Docker image for testnet
- Start the faucet container

Monitor logs:
```bash
docker logs -f test-faucet
```

Stop the faucet:
```bash
docker stop test-faucet && docker rm test-faucet
```
