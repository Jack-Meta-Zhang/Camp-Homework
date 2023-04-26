//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CallOption is ERC20 {
    struct Option {
        address token;
        uint price;
        uint time;
    }
    Option public callOption;

    constructor(address _token) ERC20("OPTION TOKEN", "OT") {
        _mint(msg.sender, 10000 * 10 ** 18);
        callOption.token = _token;
        callOption.price = 3000;
        callOption.time = block.timestamp + 2 days;
    }

    function buyOption() external payable {
        require(msg.value >= 0.01 ether, "not enough");
        _mint(msg.sender, 1);
    }

    function excOption() external payable {
        Option memory co = callOption;
        require(block.timestamp >= co.time, "not reach the time");
        require(block.timestamp < co.time + 1 days, "overtime");
        uint balance = balanceOf(msg.sender);
        require(balance >= 1, "not have the optionToken");
        require(msg.value == 1 ether, "invalid money");
        uint amount = msg.value * co.price;
        transfer(address(this), 1);
        IERC20(co.token).transfer(msg.sender, amount);
    }

    function addTime() external returns (uint) {
        callOption.time = callOption.time - 2 days;
        return callOption.time;
    }
}
//20000
