# 🔗 GPTWars-Chain-API

**GPTWars-Chain-API** is a Web3 backend API built with **NestJS**, designed to interact with the GPTWars smart contracts (ERC20 & ERC721) deployed on **Base Mainnet**. It serves as a backend gateway for the GPTWars game, handling blockchain calls for lootbox logic, cosmetics, and token transactions.

## 🚀 Features

- 📡 Communicates with smart contracts on **Base Mainnet**
- 🎁 Buy and open lootboxes via REST endpoints
- 🧑‍🎨 Fetch owned lootboxes and cosmetics for a given address
- 🛡️ Rate-limited and production-ready with NestJS
- 🔐 Supports .env configuration for keys and contract addresses

## 🛠 Tech Stack

- **NestJS** (TypeScript)
- **Web3.js** or **Ethers.js**
- **dotenv** for configuration
- **axios**, **rxjs** for HTTP services
- **Swagger/OpenAPI** support for API documentation

## 📦 Installation

```bash
git clone https://github.com/your-org/gptwars-chain-api.git
cd gptwars-chain-api
npm install
npm run start:dev
