# AgroLedger

> Securing Nigeria's Harvest through Blockchain Transparency

## 🌾 Overview

AgroLedger is a blockchain-based platform that revolutionizes agricultural commerce in Nigeria by connecting farmers directly to buyers. By eliminating middlemen through transparent, immutable records, AgroLedger ensures farmers receive fair prices for their harvest while providing buyers with verified product authenticity and traceability.

## 🎯 Mission

To empower Nigerian farmers and create a more equitable agricultural marketplace through blockchain transparency and direct farmer-to-buyer connections.

## ✨ Key Features
▶ Farmer dashboards 
▶ Blockchain-authenticated crop listings 
▶ AI-powered chatbot assistance & Image-based produce search 
▶ Role-based authentication 
▶ Marketplace Localised Search


## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/orishameedah/AgroLedger.git

# Navigate to the project directory
cd AgroLedger

# Install dependencies
npm install
# or
yarn install
```

### Development

```bash
# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000` (or your configured port).

### Build

```bash
# Build for production
npm run build
# or
yarn build
```

### Testing

```bash
# Run tests
npm test
# or
yarn test
```

## 🏗️ Architecture

### Tech Stack
- Next.js, TypeScript, Tailwind CSS, Google Translate Widget
- Database: MongoDB
- Blockchain: Solidity, Ethereum Sepolia Testnet, Ethers.js
- Development & Deployment Tools: Visual Studio Code, GitHub, Vercel 
- AI Intelligence: Google Gemini API (Vision & NLP) 
- Image Storage: Cloudinary


### Project Structure

```
AgroLedger/
├── app/                 # Next.js app directory
├── blockchain/          # Hardhat smart contracts
│   ├── contracts/       # Solidity contracts
│   ├── test/            # Contract tests (Mocha + ethers)
│   └── ignition/        # Hardhat Ignition modules
├── components/          # Next.js components
├── public/              # Static assets
├── tests/               # TypeScript integration tests
├── lib/                 # Libraries
├── models/              
└── package.json         # Project dependencies
```

## 💡 How It Works

1. **Registration**: Farmers and buyers create verified accounts on the platform
2. **Listing**: Farmers publishes their produce with specifications and pricing via their dashboards
3. **Discovery**: Buyers browse available products via the marketplace
4. **Blockchain Recording**: All published produce records are permanently recorded and verified
6. **Search**: Searching made flexible for Farmers and Buyers with AI. 

