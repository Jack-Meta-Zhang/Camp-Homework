// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FeiToken is ERC20 {
    uint private immutable _totalSupply;

    // modifier onlyOwner{

    // }

    constructor() ERC20("Fei Token", "FT") {
        _totalSupply = 100000 * 10 ** 18;
        _mint(msg.sender, _totalSupply);
    }

    function totalSupply() public view override returns (uint) {
        return _totalSupply;
    }

    // function mint(address user,uint amount) external  onlyOwner{
    //     _mint(user,amount);
    // }
}
