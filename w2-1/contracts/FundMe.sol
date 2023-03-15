//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

contract Fund {
    address public immutable owner;
    address[] public funders;
    mapping(address => uint) addressToAmount;

    event Fund(address indexed funder, uint amount);
    event Withdraw(uint balance);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {}

    fallback() external payable {}

    function fund() external payable {
        //多次存钱只记录一次
        if (addressToAmount[msg.sender] == 0) {
            funders.push(msg.sender);
        }
        addressToAmount[msg.sender] += msg.value;

        emit Fund(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        //重置用户数据，也可以不重置，看业务需求
        //uint funderNumber = funders.length;
        // for (uint i = 0; i < funderNumber; i++) {
        //     addressToAmount[funders[i]] = 0;
        // }
        // funders = new address[](0);
        uint balance = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "withdraw failed");
        emit Withdraw(balance);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }

    function getFunderNumber() external view returns (uint) {
        return funders.length;
    }
}
