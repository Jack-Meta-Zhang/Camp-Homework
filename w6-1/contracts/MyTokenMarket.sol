//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "./IMasterChef.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;

    address public myToken;
    address public router;
    address public weth;
    address public masterchef;

    constructor(
        address _token,
        address _router,
        address _weth,
        address _masterchef
    ) {
        myToken = _token;
        router = _router;
        weth = _weth;
        masterchef = _masterchef;
    }

    // 添加流动性
    function addLiquidity(uint tokenAmount) public payable {
        IERC20(myToken).safeTransferFrom(
            msg.sender,
            address(this),
            tokenAmount
        );
        IERC20(myToken).safeApprove(router, tokenAmount);

        IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(
            myToken,
            tokenAmount,
            0,
            0,
            msg.sender,
            block.timestamp
        );
    }

    // 用 ETH 购买 Token
    function buyToken(uint minTokenAmount) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = myToken;

        IUniswapV2Router01(router).swapExactETHForTokens{value: msg.value}(
            minTokenAmount,
            path,
            address(this),
            block.timestamp
        );

        uint amount = IERC20(myToken).balanceOf(address(this));
        console.log(amount, 123);
        IERC20(myToken).safeApprove(masterchef, amount);

        IMasterChef(masterchef).deposit(0, amount);
    }

    function withdraw(uint amount) public {
        IMasterChef(masterchef).withdraw(0, amount);
    }
}
