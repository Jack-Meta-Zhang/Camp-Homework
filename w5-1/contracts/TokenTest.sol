// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";

contract TokenTest is ERC20Permit {
    uint private immutable _totalSupply;

    constructor() ERC20("Fei Token", "FT") ERC20Permit("Fei Token") {
        _totalSupply = 100000 * 10 ** 18;
        _mint(msg.sender, _totalSupply);
    }

    function totalSupply() public view override returns (uint) {
        return _totalSupply;
    }
}
