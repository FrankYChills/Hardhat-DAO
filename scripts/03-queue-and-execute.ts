// @ts-ignore

import { ethers, network } from "hardhat";
import * as fs from "fs";

import {
  developmentChains,
  FUNC,
  MIN_DELAY,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  proposalsFile,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-block";
import { moveTime } from "../utils/move-time";

export async function queueAndExecute() {
  console.log("---------------------------------------------");
  console.log(
    "Voting Succeded..So queuing and executing proposals [here it is to change number to 11 in Box] "
  );

  const args = [NEW_STORE_VALUE];
  const box = await ethers.getContract("Box");
  const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
  );
  const governor = await ethers.getContract("GovernorContract");
  const proposalIndex = 0;
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));

  const proposalId = proposals[network.config.chainId!][proposalIndex];

  const proposalState = await governor.state(proposalId);

  console.log(`Current Proposal State: ${proposalState}`);
  console.log("Queuing...");
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await queueTx.wait(1);
  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }
  console.log("Executing Now ....");
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  await executeTx.wait(1);
  console.log("Executed ✅");
  const boxNewValue = await box.retrieve();
  console.log(`Value in the box is now ${boxNewValue.toString()}`);
  console.log("---------------------------------------------");
}
queueAndExecute()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
