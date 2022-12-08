//This contract controls the time operations on Governance Contract
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract Timelock is TimelockController {
    // mindelay: How long you have to wait before execution
    // proposers are people who can propose
    // executors: people who can execute an operation when any proposal passes
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors,
        address admin
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
