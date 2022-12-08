import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ADDRESS_ZERO } from "../helper-hardhat-config";
// @ts-ignore
import { ethers } from "hardhat";

const deployBox: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  // @ts-ignore

  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log, get } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log("---------------------------------------------");
  console.log("Deploying Box Contract (A DAO Contract) ...");
  // box variable here is just box contract ABI not a full contract.We can get full box contract as shown below --
  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });
  console.log("Box contract(DAO) deployed....");
  const timeLock = await ethers.getContract("Timelock");
  const boxContract = await ethers.getContractAt("Box", box.address);
  console.log(
    "Current owner of box contract is deployer (as it got deployed by deployer)"
  );
  console.log(
    "Transferring Ownership of box contract from deployer to the timelock contract.."
  );

  const transferOwnerTx = await boxContract.transferOwnership(timeLock.address);
  await transferOwnerTx.wait(1);
  console.log("Ownership Transferred✅");

  console.log("---------------------------------------------");
};
export default deployBox;
