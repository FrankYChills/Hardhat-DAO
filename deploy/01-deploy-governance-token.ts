import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("---------------------------------------------");

  console.log("Deploying Governance Token ....");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });
  console.log("Governance token deployed");
  console.log("Delegating....");

  await delegate(governanceToken.address, deployer);
  console.log("---------------------------------------------");
};

// add delegators (people who can vote) in governanceToken contract
const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string
) => {
  // get the governance contract At(name,deployed address)
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const tx = await governanceToken.delegate(delegatedAccount);
  await tx.wait(1);
  console.log(`Account ${delegatedAccount} delegated`);

  console.log(
    `Account ${delegatedAccount} Checkpoints: ${await governanceToken.numCheckpoints(
      delegatedAccount
    )}`
  );
};
export default deployGovernanceToken;
