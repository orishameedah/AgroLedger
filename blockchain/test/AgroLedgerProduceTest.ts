// import loadFixture from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import hre from "hardhat";
// network.connect() provides the ethers instance and network helpers in Hardhat v3
const { ethers, networkHelpers } = await hre.network.connect(); 

describe("AgroledgerProduce Contract", function () {
  // We use a fixture to deploy the contract once for each test group
  async function deployAgroledgerFixture() {
    const Agroledger = await ethers.deployContract("AgroledgerProduce");
    // getSigners returns an array of signers; provider.getSigner() returns only one
    const [owner, otherAccount] = await ethers.getSigners();

    return { agroledger: Agroledger, owner, otherAccount };
  }

  describe("Validation Tests", function () {
    it("Should accept valid price and quantity", async function () {
      const { agroledger } = await deployAgroledgerFixture();

      // Sync a valid product
      await agroledger.syncProduce("maize-001", 100, 50);

      const listing = await agroledger.getListing("maize-001");
      expect(listing.price).to.equal(100);
      expect(listing.quantity).to.equal(50);
    });

    it("Should fail if price is 0", async function () {
      const { agroledger } = await deployAgroledgerFixture();

      // We expect the transaction to revert with our custom error message
      await expect(
        agroledger.syncProduce("maize-002", 0, 50),
      ).to.be.revertedWith("Price must be > 0");
    });

    it("Should fail if quantity is 0", async function () {
      const { agroledger } = await deployAgroledgerFixture();

      await expect(
        agroledger.syncProduce("maize-003", 100, 0),
      ).to.be.revertedWith("Quantity must be > 0 to publish");
    });

    it("Should fail if ID is an empty string", async function () {
      const { agroledger } = await deployAgroledgerFixture();

      await expect(agroledger.syncProduce("", 100, 50)).to.be.revertedWith(
        "ID required",
      );
    });
  });
});
