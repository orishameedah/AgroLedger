// ignition/AgroledgerModule.ts
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("AgroledgerProduceModule", (m) => {
  // Deploy the Agroledger contract
  const agroledger = m.contract("AgroledgerProduce");

  // We don’t need to call any functions, just export the deployed contract
  return { agroledger };
});
