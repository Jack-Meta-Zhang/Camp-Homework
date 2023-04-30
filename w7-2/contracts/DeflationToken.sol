// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract DeflationToken is ERC20 {
    uint public K = 100;
    address public immutable owner;

    constructor() ERC20("Deflation Token", "DT") {
        _mint(msg.sender, 100000 * 10 ** decimals());
        owner = msg.sender;
    }

    function balanceOf(address account) public view override returns (uint256) {
        return (super.balanceOf(account) * K) / 100;
        // _balances[account]
    }

    function rebase(uint reduce) public {
        require(msg.sender == owner, "not owner");
        require(reduce < 100, "invalid reduce");
        K = (K * (100 - reduce)) / 100;
    }
}
