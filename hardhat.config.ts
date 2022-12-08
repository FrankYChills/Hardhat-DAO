/** @type import('hardhat/config').HardhatUserConfig */
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import { HardhatUserConfig } from "hardhat/config";
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.8.9",
      },
    ],
  },
  defaultNetwork: "hardhat",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    hardhat: { chainId: 31337, allowUnlimitedContractSize: true },
    localhost: { chainId: 31337, allowUnlimitedContractSize: true },
  },
};
