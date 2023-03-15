//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

contract Bank {
    address[] public owners;
    mapping(address => uint) internal addressToAmount;

    event Deposit(address indexed owner, uint amount);
    event Withdraw(address indexed owner, uint balance);

    constructor() {}

    receive() external payable {}

    fallback() external payable {}

    function deposit() external payable {
        //多次存钱只记录一次
        if (addressToAmount[msg.sender] == 0) {
            owners.push(msg.sender);
        }
        addressToAmount[msg.sender] += msg.value;

        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() external {
        uint balance = addressToAmount[msg.sender];
        require(balance > 0, "no money in bank");
        addressToAmount[msg.sender] = 0; //先重置存款为0
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "withdraw failed");
        emit Withdraw(msg.sender, balance);
    }

    function getBalance() external view returns (uint) {
        return addressToAmount[msg.sender];
    }

    function getUserNumber() external view returns (uint) {
        return owners.length;
    }
}
