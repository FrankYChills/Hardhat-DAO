import { ethers, network } from "hardhat";
import { json } from "stream/consumers";
import * as fs from "fs";
import {
  FUNC,
  NEW_STORE_VALUE,
  PROPOSAL_DESCRIPTION,
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} from "../helper-hardhat-config";
import { moveBlocks } from "../utils/move-block";
export async function propose(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");
  console.log("Got governor and box contract");
  console.log("Encoding store function of box contract ..");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );
  console.log(
    `Proposing ${functionToCall} (to call this function/or change the value to 11) with args ${args}`
  );
  console.log(`Proposal description :  ${proposalDescription}`);
  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );
  const proposeReceipt = await proposeTx.wait(1);
  if (developmentChains.includes(network.name)) {
    console.log("local network detected ....");
    await moveBlocks(VOTING_DELAY + 1);
  }
  console.log(
    "Getting proposal id which gets emitted after proposal is successful .."
  );

  const proposalId = proposeReceipt.events[0].args.proposalId;
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  console.log("Saving proposal id to proposals.json ..");

  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}
propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
