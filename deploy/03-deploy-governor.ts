import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// @ts-ignore

import { ethers } from "hardhat";
import {
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_PERCENTAGE,
} from "../helper-hardhat-config";

const deployGovernorContract: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore

  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  // for working with governor contract we need governance and timelock contract
  console.log("---------------------------------------------");
  console.log("Getting governance and timelock contract ...");
  const governanceToken = await get("GovernanceToken");
  const timeLock = await get("Timelock");
  console.log("Deploying Governor contract ....");
  const governorContract = await deploy("GovernorContract", {
    from: deployer,
    args: [
      governanceToken.address,
      timeLock.address,
      VOTING_DELAY,
      VOTING_PERIOD,
      QUORUM_PERCENTAGE,
    ],
    log: true,
    waitConfirmations: 1,
  });
  console.log("Governor contract deployed....");
  console.log("---------------------------------------------");
};

export default deployGovernorContract;
