# 📋 Project Configuration - Discord Faucet Bot

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🚨 IMPORTANT RULES
- **NEVER** expose Discord tokens or seed phrases in commits or logs
- **ALWAYS** validate Zeitgeist addresses before processing transfers (SS58 format 73)
- **ENFORCE** rate limiting: 24-hour cooldown on testnet, one-time codes on mainnet
- **PREVENT** concurrent transactions using isProcessing lock on mainnet
- **DELETE** invalid Discord messages immediately to keep channel clean
- **VERIFY** promotional codes against environment variables before processing

## 🎯 PROJECT CONTEXT
- **Project Type**: Discord bot faucet for Zeitgeist blockchain token distribution
- **Purpose**: Distribute ZBS (testnet) and ZTG (mainnet) tokens to community members
- **Technology Stack**:
  - TypeScript with Node.js 18
  - Modern ES6+ JavaScript and TypeScript patterns
  - Discord.js v12 for bot functionality
  - @zeitgeistpm/sdk for blockchain interactions
  - Polkadot/Substrate libraries (stable 2409) for address handling
  - NeDB for embedded database storage
- **Architecture**: Dual-mode faucet with separate entry points for testnet/mainnet

## Core Development Philosophy
**KISS (Keep It Simple, Stupid)**
Simplicity should be a key goal in design. Choose straightforward solutions over complex ones whenever possible. Simple solutions are easier to understand, maintain, and debug.
**YAGNI (You Aren't Gonna Need It)**
Avoid building functionality on speculation. Implement features only when they are needed, not when you anticipate they might be useful in the future.

## 🔧 DEVELOPMENT PATTERNS
- **Commands**:
  ```bash
  yarn install          # Install dependencies
  yarn build           # Compile TypeScript
  yarn start:test      # Run testnet faucet
  yarn start:main      # Run mainnet faucet
  yarn eslint src --ext .ts    # Lint code
  yarn prettier --write "src/**/*.ts"  # Format code
  ```
- **File Organization**:
  - `src/index.ts`: Testnet bot entry (!drip commands)
  - `src/main.ts`: Mainnet bot entry (!ser commands)
  - `src/sender.ts`: Blockchain transaction handler
  - `src/db.ts`: Database operations wrapper
  - `src/config.ts`: TOML configuration parser
- **Code Patterns**:
  - Modern ES6+ features: async/await, arrow functions, destructuring, template literals
  - TypeScript strict typing for type safety
  - Promise-based asynchronous operations
  - ES6 module imports/exports
- **Testing**: No test suite configured (npm test exits with error)
- **Code Style**: ESLint + Prettier with TypeScript rules

## 🐝 SWARM ORCHESTRATION
- **Single Bot Instance**: Each environment (test/main) runs one bot instance
- **Transaction Locking**: `isProcessing` flag prevents concurrent blockchain operations
- **Message Processing**: Sequential processing of Discord commands
- **Database Access**: Single NeDB instance per bot, no concurrent access issues

## 🧠 MEMORY MANAGEMENT
- **Database Storage**:
  - User rate limits: `{userId, at}` 
  - Promotional codes: `{code, address, amount}`
  - KSM addresses: `{ksmAddress, done}`
- **Configuration Loading**: TOML files loaded once at startup
- **Environment Variables**: Promotional codes stored as `codes=CODE1+AMOUNT1,CODE2+AMOUNT2`
- **Transaction History**: Stored in local NeDB database files

## 🚀 DEPLOYMENT & CI/CD
- **Docker Deployment**:
  ```bash
  sh ./scripts/run.sh test  # Deploy testnet faucet
  sh ./scripts/run.sh main  # Deploy mainnet faucet
  sh ./scripts/docker-hub-publish.sh  # Publish to Docker Hub
  ```
- **Build Process**: Multi-stage Docker build (builder → deps → faucet → test/main)
- **Database Persistence**: Docker volumes mount local database files
- **Configuration**: Separate TOML files for test/main environments

## 📊 MONITORING & ANALYTICS
- **Console Logging**: Transaction success/failure logged to stdout
- **Error Tracking**: SDK error table provides detailed failure reasons
- **User Tracking**: Database tracks request history and timestamps
- **Transaction Monitoring**: Each transfer logged with amount and destination

## 🔒 SECURITY & COMPLIANCE
- **Access Control**:
  - Team role IDs hardcoded for special privileges
  - Channel ID validation for command processing
  - Self-message prevention (bot ID: 1205221932740386896)
- **Secret Management**:
  - Discord tokens in TOML configuration files
  - Seed phrases for wallet access (never log these)
  - Promotional codes in environment variables
- **Rate Limiting**:
  - 24-hour cooldown between testnet requests
  - One-time promotional codes for mainnet
  - Team members bypass testnet rate limits
- **Address Validation**: All addresses validated and re-encoded to SS58 format 73