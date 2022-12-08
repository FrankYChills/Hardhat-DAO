import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ADDRESS_ZERO } from "../helper-hardhat-config";
// @ts-ignore
import { ethers } from "hardhat";

const setupContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore

  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("---------------------------------------------");
  console.log(
    "Getting governance ,timelock and governor contract and connecting deployer account to them ..."
  );
  // get governance contract and connect deployer account to it
  const governanceToken = await ethers.getContract("GovernanceToken", deployer);
  const timeLock = await ethers.getContract("Timelock", deployer);
  const governor = await ethers.getContract("GovernorContract", deployer);
  console.log("Got contracts");
  console.log("---------------------------------------------");
  const proposerRole = await timeLock.PROPOSER_ROLE();
  const executorRole = await timeLock.EXECUTOR_ROLE();
  const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();

  console.log(
    "Granting and revoking roles to/from timelock contract [as timelock contract have to execute operations]"
  );

  console.log("Granting proposerRole to the governor contract ...");
  const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
  await proposerTx.wait(1);
  console.log("Granting executorRole to the No one ...");
  const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
  await executorTx.wait(1);
  console.log("Revoking Admin role from the deployer on timelock contract ...");
  const revokeTx = await timeLock.revokeRole(adminRole, deployer);
  await revokeTx.wait(1);
  console.log(
    "Tadaa...Now if timelock contract wants to execute something it can be done only via governor contract"
  );
  console.log("---------------------------------------------");
};
export default setupContracts;
