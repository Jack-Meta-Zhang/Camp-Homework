//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./uniswap/v2-periphery/interfaces/IUniswapV2Router01.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "hardhat/console.sol";

contract MyTokenMarket {
    using SafeERC20 for IERC20;
    address public router;
    address public weth;

    constructor(address _router, address _weth) {
        router = _router;
        weth = _weth;
    }

    // 添加流动性
    function AddLiquidity(
        address token0,
        address token1,
        uint token0Amount,
        uint token1Amount
    ) public {
        IERC20(token0).safeTransferFrom(
            msg.sender,
            address(this),
            token0Amount
        );

        IERC20(token1).safeTransferFrom(
            msg.sender,
            address(this),
            token1Amount
        );
        IERC20(token0).safeApprove(router, token0Amount);
        IERC20(token1).safeApprove(router, token0Amount);

        IUniswapV2Router01(router).addLiquidity(
            token0,
            token1,
            token0Amount,
            token1Amount,
            0,
            0,
            msg.sender,
            block.timestamp
        );

        //TODO: handle left
    }

    // 添加流动性eth
    function AddLiquidityETH(address token, uint tokenAmount) public payable {
        IERC20(token).safeTransferFrom(msg.sender, address(this), tokenAmount);
        IERC20(token).safeApprove(router, tokenAmount);

        IUniswapV2Router01(router).addLiquidityETH{value: msg.value}(
            token,
            tokenAmount,
            0,
            0,
            msg.sender,
            block.timestamp
        );

        //TODO: handle left
    }

    // 用 ETH 购买 Token
    function swapETHForTokens(
        address token,
        uint minTokenAmount
    ) public payable {
        address[] memory path = new address[](2);
        path[0] = weth;
        path[1] = token;
        IUniswapV2Router01(router).swapExactETHForTokens{value: msg.value}(
            minTokenAmount,
            path,
            msg.sender,
            block.timestamp
        );
    }

    //兑换token
    function swapTokensForTokens(
        address token0,
        address token1,
        uint amountIn,
        uint minTokenAmount
    ) public {
        address[] memory path = new address[](2);
        path[0] = token0;
        path[1] = token1;

        IERC20(token0).safeTransferFrom(msg.sender, address(this), amountIn);
        IERC20(token0).safeApprove(router, amountIn);
        IUniswapV2Router01(router).swapExactTokensForTokens(
            amountIn,
            minTokenAmount,
            path,
            msg.sender,
            block.timestamp
        );
    }

    // 添加流动性
    function removeLiquidity(
        address token0,
        address token1,
        uint liquidity,
        uint token0Min,
        uint token1Min,
        address pair
    ) public {
        IERC20(pair).safeTransferFrom(msg.sender, address(this), liquidity);
        IERC20(pair).safeApprove(router, liquidity);
        IUniswapV2Router01(router).removeLiquidity(
            token0,
            token1,
            liquidity,
            token0Min,
            token1Min,
            msg.sender,
            block.timestamp
        );

        //TODO: handle left
    }
}
