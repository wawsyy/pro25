# Nightly Reflection - Encrypted Reflection Journal

A fully homomorphic encryption (FHE) enabled dApp for storing encrypted nightly reflection entries on the blockchain.

## Enhanced Features

- **Encrypted Storage**: Store your nightly reflections (stress level, achievement, mindset adjustment) with FHE encryption
- **Privacy First**: Your reflection data is encrypted and only you can decrypt it
- **Blockchain Storage**: Reflections are stored on-chain using Zama FHEVM
- **Rainbow Wallet Integration**: Connect using Rainbow wallet for seamless Web3 experience

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   cd frontend
   npm install
   ```

2. **Set up environment variables**

   ```bash
   npx hardhat vars set MNEMONIC
   npx hardhat vars set INFURA_API_KEY
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

3. **Compile contracts**

   ```bash
   npm run compile
   ```

4. **Run tests**

   ```bash
   npm run test
   ```

5. **Deploy to local network**

   ```bash
   # Start a local FHEVM-ready node
   npx hardhat node
   # In another terminal, deploy to local network
   npx hardhat deploy --network localhost
   ```

6. **Deploy to Sepolia Testnet**

   ```bash
   npx hardhat deploy --network sepolia
   ```

7. **Start frontend**

   ```bash
   cd frontend
   npm run dev
   ```

## Project Structure

```
pro25/
├── contracts/              # Smart contract source files
�?  └── NightlyReflection.sol
├── deploy/                 # Deployment scripts
├── frontend/               # Next.js frontend application
�?  ├── app/               # Next.js app router pages
�?  ├── components/        # React components
�?  ├── hooks/             # Custom React hooks
�?  └── fhevm/            # FHEVM integration
├── test/                  # Test files
├── tasks/                 # Hardhat custom tasks
└── hardhat.config.ts     # Hardhat configuration
```

## Available Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run compile`  | Compile all contracts    |
| `npm run test`     | Run all tests            |
| `npm run test:sepolia` | Run tests on Sepolia |
| `npm run coverage` | Generate coverage report |
| `npm run lint`     | Run linting checks       |
| `npm run clean`    | Clean build artifacts    |

## Frontend Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run genabi`   | Generate contract ABI    |

## Contract Functions

### `addReflection`
Store a new nightly reflection entry with encrypted values.

Parameters:
- `stressLevel`: Encrypted stress level (0-100)
- `achievement`: Encrypted achievement level (0-100)
- `mindsetAdjustment`: Encrypted mindset adjustment level (0-100)

### `getMyReflection`
Retrieve your reflection entry (encrypted).

Returns:
- `stressLevel`: Encrypted stress level
- `achievement`: Encrypted achievement level
- `mindsetAdjustment`: Encrypted mindset adjustment level
- `isInitialized`: Whether entry exists

### `getTotalReflections`
Get total number of reflections stored (encrypted count).

## Testing

### Local Testing

```bash
npm run test
```

### Sepolia Testing

```bash
# First deploy to Sepolia
npx hardhat deploy --network sepolia

# Then run tests
npm run test:sepolia
```

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [RainbowKit Documentation](https://rainbowkit.com)
- [Zama Discord](https://discord.gg/zama)

## License

BSD-3-Clause-Clear

---

**Built with ❤️ using Zama FHEVM**



