// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract StakingMining {
    // 定义质押代币的地址
    IERC20 public token;

    // 定义质押记录结构体
    struct StakeRecord {
        address staker; // 质押者地址
        uint amount; // 质押数量
        uint startTime; // 质押开始时间
    }

    // 定义质押周期和利率
    mapping(uint => uint) public rateToTime;
    // 定义质押记录mapping
    mapping(uint => mapping(address => StakeRecord[])) public rateToStake;

    // 构造函数，初始化质押代币地址
    constructor(address _token) {
        token = IERC20(_token);
        rateToTime[5] = 30 days;
        rateToTime[10] = 60 days;
        rateToTime[15] = 100 days;
        rateToTime[20] = 200 days;
    }

    // 质押函数
    function stake(uint _rate, uint _amount) public {
        require(token.balanceOf(msg.sender) >= _amount, "Insufficient balance");
        require(rateToTime[_rate] > 0, "invaid rate");

        // 转移质押代币到合约地址
        token.transferFrom(msg.sender, address(this), _amount);

        // 添加质押记录
        StakeRecord[] storage records = rateToStake[_rate][msg.sender];
        records.push(StakeRecord(msg.sender, _amount, block.timestamp));
    }

    // 赎回函数
    function redeem(uint _rate, uint _index) public {
        StakeRecord[] storage records = rateToStake[_rate][msg.sender];
        require(records.length > 0, "no stake");
        require(_index < records.length, "Invalid index");

        StakeRecord storage s = records[_index];
        require(msg.sender == s.staker, "Unauthorized");
        require(
            block.timestamp >= s.startTime + rateToTime[_rate],
            "not reach the time"
        );

        // 计算挖矿奖励
        uint reward = (s.amount * _rate * (block.timestamp - s.startTime)) /
            rateToTime[_rate];

        // 转移挖矿奖励和质押代币到用户地址
        token.transfer(msg.sender, s.amount + reward);

        // 删除质押记录
        delete records[_index];
    }
}
//2592000
//2000000
