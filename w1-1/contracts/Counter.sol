//SPDX-License-Identifier:MIT
pragma solidity ^0.8.18;

contract Counter {
    uint public counter;

    constructor() {
        counter = 1;
    }

    function add(uint x) public {
        counter += x;
    }
}
