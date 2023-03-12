// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity  ^0.8.7;

import "hardhat/console.sol";

contract Counter {
    uint public counter;
    address public immutable owner;
    constructor() {
        owner = msg.sender;
        counter = 1;
        console.log("counter is init : %s",counter);
    }
    modifier onlyOwner {
        require(msg.sender == owner,"not owner");
        _;
    }

    function  add (uint x) external {
        counter += x;
    }

    function count() external onlyOwner{
        counter += 5;
    }
}