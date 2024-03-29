//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SushiToken is ERC20, Ownable {
    constructor() ERC20("SushiToken", "SUSHI") {
        // _mint(msg.sender, 10000 * 10 ** 18);
    }

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}
