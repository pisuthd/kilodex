# KiloDEX

<div align="center">

<img width="1289" height="706" alt="Screenshot from 2026-01-29 23-35-38" src="https://github.com/user-attachments/assets/b25637ff-7b0e-4ba6-a5de-566e8fb577d4" />

[Live Demo](https://kilodex.xyz) • [YouTube Video](https://youtu.be/UvyyKhmTAt8)

</div>

**KiloDEX is a privacy-first AMM decentralized exchange designed for institutional liquidity providers.**
It leverages zero-knowledge proofs to protect sensitive trading data while preserving the compliance, auditability, and control required by regulated participants.

KiloDEX is built from the ground up to support:

- **Selective access to liquidity**
- **Private but auditable settlement**
- **Gradual decentralization without compromising institutional standards**

The protocol is designed to support multiple privacy-preserving blockchains over time, starting with **Aleo**. By leveraging technologies such as **zPass**, individual liquidity providers can selectively permit traders who meet specific regulatory criteria—such as KYC/AML status, jurisdiction, or entity type—without revealing identities or sensitive data on-chain.

## Highlighted Features

- **Selective Access via zPass** – Enforce KYC/AML, jurisdiction, or entity requirements using zero-knowledge credentials without identity disclosure.
- **Selective Transparency with View Keys** – Grant auditors or regulators read-only access to specific activity while keeping all other data private.
- **Shielded Liquidity Positions** - Individual LP balances and strategies remain private and invisible to others.
- **Multi-Chain Privacy Roadmap** – Starting on Aleo, designed to expand to Midnight and Canton

## Problem Statement

### Why Institutions Avoid DEXs

Traditional AMMs (e.g., Uniswap) expose institutional liquidity providers to fundamental risks:

- **Anonymous counterparties** with no screening or accountability
- **Regulatory uncertainty** and lack of on-chain compliance guarantees
- **Front-running, toxic flow, and strategy leakage**
- **No ability** to restrict, approve, or rate counterparties

Orderbook-based DEXs improve pricing efficiency but still fail to provide:

- **Confidential counterparty screening**
- **Policy-based trade permissions**
- **Verifiable, on-chain compliance assurances**

As a result, most institutional liquidity remains off-chain.

### The Missing Primitive

Institutions do not need permissionless liquidity — they need controlled liquidity.

The core question is:

> *Who is allowed to trade against my capital — and under what conditions?*

Existing DEX architectures cannot answer this without introducing centralized gatekeepers or off-chain trust assumptions.

## KiloDEX Overview

KiloDEX is a privacy-native AMM liquidity protocol that enables institutions to provide on-chain liquidity with control, confidentiality, and verifiable compliance.

<img width="783" height="378" alt="kilodex drawio" src="https://github.com/user-attachments/assets/b415e8cf-4381-4a14-b105-7a2807d9b942" />

The protocol explicitly separates public market data from private institutional state. This ensures transparent price discovery and verifiable execution, while protecting sensitive liquidity and strategy information.

#### Public State (Visible On-Chain)

The following data is public to enable correct pricing, verification, and open market interaction:

- **Total reserve of token A** (Reserve A)
- **Total reserve of token B** (Reserve B)
- **AMM pricing model** (constant-product: x · y = k) and fee parameters
- **Pool-level configuration and policy commitments (hashes)**

This public state is sufficient to:

- Calculate swap prices deterministically
- Verify AMM execution correctness
- Ensure transparent and predictable market behavior

#### Private State (Shielded by Zero-Knowledge)

The following data is private by default and never exposed publicly:

- **Individual liquidity provider positions**
- **LP token balances and ownership**
- **Deposit and withdrawal timing**
- **Rebalancing behavior and strategy**
- **Trader eligibility proofs and credentials**

Eligibility checks and policy enforcement are performed using zero-knowledge proofs, allowing trades to execute only when requirements are met, without revealing identities or sensitive compliance data.

Private state is stored using zero-knowledge–native data models and can only be accessed by authorized parties through cryptographic proofs, while settlement correctness remains provable on-chain.

## Project Structure

Aleo program is at the root level, and frontend has the Next.js application.

```
kilodex/
├── frontend/                  # Next.js 16 web application
├── src/                      # Aleo programs (Leo language)
│   └── main.leo             # Core DEX / Mock Tokens
├── tests/                    # Leo smart contract tests
├── outputs/                  # Build artifacts
├── program.json             # Aleo program configuration
└── README.md                # This file
```

## Architecture
> *Note: Currently in early development with basic functionality implemented. Additional functions for institutional controls will be added soon.*

KiloDEX is built on the Aleo blockchain using privacy-preserving smart contracts (programs) written in Leo. The protocol leverages zero-knowledge proofs to separate public market data from private institutional state, allowing controlled liquidity access while maintaining transparent AMM pricing through public pool reserves.

### Core Components

KiloDEX consists of two main on-chain subsystems:

- A **token system**, used to model assets and balances
- A **minimal AMM DEX**, responsible for pool state, pricing, and swap execution

These components are composed into a single `main.aleo` program in Wave 1.

---

### Core Data Structures

#### Token System

The token system is a simplified, mock implementation used for testing and end-to-end validation.

```leo
struct TokenInfo {
    token_id: u64,
    decimals: u8,
    total_supply: u128,
}

record Token {
    owner: address,
    token_id: u64,
    amount: u128,
}
```

- `TokenInfo` defines token metadata and global supply
- `Token` records represent user-owned balances and are stored privately by default
- This system will be replaced by ARC-20 tokens via a registry in future waves

#### AMM System

The AMM system manages pool-level state required for pricing and swap execution

```leo
struct PoolInfo {
    token_a_id: u64,
    token_b_id: u64,
    reserve_a: u128,
    reserve_b: u128,
    lp_total_supply: u128,
    swap_fee: u128,
}
```

- Pool reserves are stored publicly to enable transparent price discovery
- Pricing follows the classic constant-product formula: `x * y = k`
- LP total supply is tracked at the pool level, while individual LP positions remain private
- Policy rules are represented as commitments (hashes) and enforced via ZK proofs in later waves

### Key Functions

**Token System Functions:**
- `create_token()`: Initializes a new token type with configurable decimals and supply
- `mint()`: Mints tokens to a specific address for testing and demo purposes
- `transfer_public()`: Executes public token transfers to support transparent swap settlement

**DEX System Functions:**
- `create_pool()`: Creates a new AMM pool with initial reserves and configuration parameters
- `swap_exact_tokens_for_tokens()`: Execute trades with minimum output guarantees and slippage protection

## Quick Start

### Prerequisites
- Node.js 20+ and npm/yarn
- Aleo account and wallet (for testnet)
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/pisuthd/kilodex
cd kilodex
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:3000` to access the application.

### Smart Contract Development

We follow best practices with comprehensive test coverage for all smart contract functionality.

1. **Install Leo** (if not already installed)
```bash
# Download the source code and initialize the submodules
git clone --recurse-submodules https://github.com/ProvableHQ/leo
cd leo

# Install 'leo'
cargo install --path .
```

2. **Compile the smart contract**
```bash
leo build
```

3. **Run tests**
```bash
leo test
```

## Technology Stack

### Frontend
- **Next.js 16**: Modern React framework with App Router
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Aleo Wallet Adapter**: Seamless wallet integration

### Blockchain
- **Aleo**: Privacy-focused blockchain platform
- **Leo**: High-level programming language for zero-knowledge applications
- **Zero-Knowledge Proofs**: Privacy-preserving transaction validation
- **Private Records**: On-chain data privacy model

##  Development Status 

### Wave 1 - Foundation (Complete)
- Core DEX functionality with Aleo smart contracts
- Modern Next.js frontend with wallet integration
- Testnet deployment with demo tokens (WALEO, USDC)
- Basic token swap functionality with price discovery

### Wave 2 - Policy-Controlled Liquidity (In Progress)
- Zero-knowledge credential verification via zPass
- Liquidity provider controls for trader eligibility criteria
- Smart contract policy enforcement mechanisms
- Credential marketplace for trader onboarding

### Wave 3 - Token Registry Integration
- Singleton token registry for ARC-20 token management
- Migration from mock tokens to real ARC-20 assets
- Multi-token support and cross-program interactions
- Unified balance tracking across token types

### Wave 4 - Advanced AMM Implementation
- Complete liquidity pool management interface
- LP token operations with registry integration
- Automated fee distribution to liquidity providers
- Real-time price impact calculations and trading history

### Wave 5-10 - Production & Advanced Features
- Enhanced privacy features with view key management
- Comprehensive compliance and reporting tools
- Selective disclosure mechanisms for auditors
- Advanced AMM features: multi-token pools, dynamic fees
- Production deployment with complete infrastructure

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
---
