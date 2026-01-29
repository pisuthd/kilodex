# KiloDex 

**KiloDEX is a privacy-first AMM decentralized exchange designed for institutional liquidity providers.**
It leverages zero-knowledge proofs to protect sensitive trading data while preserving the compliance, auditability, and control required by regulated participants.

KiloDEX is built from the ground up to support:

- **Selective access to liquidity**
- **Private but auditable settlement**
- **Gradual decentralization without compromising institutional standards**

The protocol is designed to support multiple privacy-preserving blockchains over time, starting with Aleo. By leveraging technologies such as **zPass**, individual liquidity providers can selectively permit traders who meet specific regulatory criteria—such as KYC/AML status, jurisdiction, or entity type—without revealing identities or sensitive data on-chain.

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

**Who is allowed to trade against my capital — and under what conditions?**

Existing DEX architectures cannot answer this without introducing centralized gatekeepers or off-chain trust assumptions.

### KiloDEX Overview

KiloDEX is a privacy-native AMM liquidity protocol that enables institutions to provide on-chain liquidity with control, confidentiality, and verifiable compliance.

The protocol explicitly separates public market data from private institutional state, ensuring price discovery remains transparent while sensitive information stays protected.

#### Public State (Visible On-Chain)

The following data is public to ensure correct AMM pricing and market transparency:

- **Total reserve of token A** (Reserve A)
- **Total reserve of token B** (Reserve B)
- **AMM pricing function and fee parameters**
- **Pool-level configuration and policy hashes**

This public state is sufficient to:

- Calculate swap prices
- Verify AMM correctness
- Enable transparent market interaction

#### Private State (Shielded by Zero-Knowledge)

The following data is private by default and never exposed publicly:

- **Individual liquidity provider positions**
- **LP token balances and ownership**
- **Deposit and withdrawal timing**
- **Rebalancing behavior and strategy**

Private state is stored using zero-knowledge–native data models and can only be accessed by authorized parties via cryptographic proofs.

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

KiloDEX leverages privacy-preserving Aleo blockchain smart contracts (programs) written in Leo. The protocol uses zero-knowledge proofs to enable controlled liquidity access while maintaining transparent price discovery through public AMM reserves and private institutional positions.

### Core Data Structures

#### Token System
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

#### AMM System
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

### Key Functions

**Token System Functions:**
- `create_token()`: Initialize new token types with custom decimals
- `mint()`: Mint tokens to specific addresses
- `transfer_public()`: Public token transfers for transparency

**DEX System Functions:**
- `create_pool()`: Create new liquidity pools with policy controls
- `swap_exact_tokens_for_tokens()`: Execute trades with minimum output guarantees and slippage protection

*Note: Currently in early development with core functionality implemented. Additional functions for advanced features, governance, and institutional controls will be added soon.*

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

### Wave #1: Foundation ✅ Complete
- ✅ **Frontend**: Complete Next.js application with modern UI
- ✅ **Smart Contract**: Core DEX functionality implemented
- ✅ **Wallet Integration**: Aleo wallet adapter fully integrated
- ✅ **Testnet Deployment**: Deployed on Aleo Testnet Beta
- ✅ **Demo Tokens**: WALEO and USDC available for testing
- ✅ **Basic Trading**: Token swaps with exchange rate calculations

### Wave #2: Policy-Controlled Liquidity
- 🔄 **zPass Integration**: Implement zero-knowledge credential verification
- 🔄 **Liquidity Provider Controls**: UI for LPs to set trader criteria (KYC status, jurisdiction, entity type)
- 🔄 **Policy Enforcement**: Smart contract validation of trader eligibility
- 🔄 **Credential Marketplace**: Interface for traders to obtain required zPass credentials

### Wave #3: Token Registry Integration
- ⏳ **Token Registry Program**: Implement singleton token registry for managing multiple ARC-20 tokens
- ⏳ **Multi-Token Support**: Transition from mock internal tokens to real ARC-20 tokens
- ⏳ **Registry Interface**: UI for browsing and selecting supported tokens
- ⏳ **Cross-Program Calls**: Handle interactions between DEX and token registry programs
- ⏳ **Balance Management**: Unified balance tracking across multiple token types

### Wave #4: Advanced AMM Implementation
- ⏳ **Liquidity Pool Management**: Full UI for creating and managing real token pools
- ⏳ **LP Token Operations**: Mint, burn, and transfer LP tokens with registry integration
- ⏳ **Fee Distribution**: Automatic fee collection and distribution to LPs
- ⏳ **Price Impact Calculations**: Real-time price impact estimation
- ⏳ **Transaction History**: Comprehensive trading history for users

### Wave #5-10: Advanced Features & Production
- ⏳ **Privacy Features**: View key management, private position tracking, confidential trading
- ⏳ **Compliance Tools**: Regulatory reporting, audit trails, policy enforcement
- ⏳ **Selective Disclosure**: Controlled data sharing mechanisms
- ⏳ **Advanced AMM**: Multi-token pools, dynamic fees, cross-pool routing
- ⏳ **Production Ready**: Mainnet deployment, complete documentation, support infrastructure

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
 
---
