// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Vault {
    using SafeERC20 for IERC20;

    mapping(address => uint) public addressToAmount;
    IERC20 private immutable token;

    event Deposit(address indexed user, uint amount);
    event Withdraw(address indexed user, uint amount);

    constructor(address _token) {
        token = IERC20(_token);
    }

    receive() external payable {}

    function deposit(uint amount) external {
        token.safeTransferFrom(msg.sender, address(this), amount);
        addressToAmount[msg.sender] += amount;
        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint amount) external {
        require(addressToAmount[msg.sender] > 0, "not enough token");
        addressToAmount[msg.sender] -= amount;
        token.safeTransfer(msg.sender, amount);
        emit Withdraw(msg.sender, amount);
    }
}
