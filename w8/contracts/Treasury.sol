// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract Treasury {
    address public immutable owner;

    constructor(address _owner) {
        owner = _owner;
    }

    event Withdraw(address indexed owner, uint amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    receive() external payable {}

    function withdraw(address to, uint amount) external onlyOwner {
        uint value = address(this).balance;
        require(value >= amount, "not enough money");
        payable(to).transfer(amount);
        emit Withdraw(to, amount);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}

//5000000000000000000   0x617F2E2fD72FD9D5503197092aC168c91465E7f2
