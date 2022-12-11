// @ts-ignore

import { ethers, network } from "hardhat";
import {
  developmentChains,
  proposalsFile,
  VOTING_DELAY,
} from "../helper-hardhat-config";
import * as fs from "fs";
import { moveBlocks } from "../utils/move-block";

const index = 0;
async function main(proposalIndex: number) {
  console.log("---------------------------------------------");

  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));

  console.log("Getting proposal Id ....");

  const proposalId = proposals[network.config.chainId!][proposalIndex];
  console.log(`ProposalId : ${proposalId}`);

  // 0 - Against  1 - Favour
  const governor = await ethers.getContract("GovernorContract");
  const voteWay = 1;
  const reason = "Number 11 is going to skyrocket the growth";
  console.log("Voting with 1 (In Favour) ");

  const voteTxResponse = await governor.castVoteWithReason(
    proposalId,
    voteWay,
    reason
  );
  const voteTxReceipt = await voteTxResponse.wait(1);

  console.log(voteTxReceipt.events[0].args.reason);
  const proposalState = await governor.state(proposalId);

  console.log(`Current Proposal State: ${proposalState}`);
  if (developmentChains.includes(network.name)) {
    console.log("local network detected ....");
    await moveBlocks(VOTING_DELAY + 1);
  }
  console.log("Vote Casted ✅");

  console.log("---------------------------------------------");
}

main(index)
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
