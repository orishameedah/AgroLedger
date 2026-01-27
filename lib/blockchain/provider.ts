// lib/blockchain/provider.ts

// import { ethers } from "ethers";
// import AgroledgerABI from "@/lib/blockchain/abi/AgroledgerProduce.json";

// export const getAgroledgerContract = () => {
//   // 1. Provider (read blockchain)
//   const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

//   // 2. Backend signer (your system wallet)
//   const signer = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY!, provider);

//   // 3. Contract instance
//   return new ethers.Contract(
//     process.env.AGROLEDGER_CONTRACT_ADDRESS!,
//     AgroledgerABI,
//     signer,
//   );
// };

// lib/blockchain/provider.ts
import { ethers } from "ethers";
import AgroledgerABI from "@/lib/blockchain/abi/AgroledgerProduce.json";

export const getAgroledgerContract = () => {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  const privateKey = process.env.SEPOLIA_PRIVATE_KEY;
  const contractAddress = process.env.AGROLEDGER_PRODUCE_CONTRACT_ADDRESS;

  // 1. Safety Checks: If any of these are missing, throw a CLEAR error
  if (!rpcUrl) throw new Error("Missing SEPOLIA_RPC_URL in .env");
  if (!privateKey) throw new Error("Missing SEPOLIA_PRIVATE_KEY in .env");
  if (!contractAddress)
    throw new Error("Missing AGROLEDGER_CONTRACT_ADDRESS in .env");

  // 2. Setup Provider and Signer
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  // 3. Contract instance
  return new ethers.Contract(contractAddress, AgroledgerABI, signer);
};
