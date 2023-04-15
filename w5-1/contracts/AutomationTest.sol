// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

interface IVault {
    function deposited(address _addr) external returns (uint);

    function withdraw(address _addr, uint amount) external;
}

contract AutomationTest is AutomationCompatibleInterface {
    IVault internal vault;
    address private owner;

    constructor(address _vault) {
        vault = IVault(_vault);
        owner = msg.sender;
    }

    event Withdraw(address owner, uint balance);

    error UpkeepNotNeeded();

    function checkUpkeep(
        bytes memory /*checkData*/
    ) public override returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = vault.deposited(msg.sender) > 2e18;
        performData = "0x0";
    }

    function performUpkeep(bytes calldata /*performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        if (!upkeepNeeded) {
            revert UpkeepNotNeeded();
        }
        uint balance = vault.deposited(msg.sender);
        uint withdrawBalance = balance / 2;
        vault.withdraw(msg.sender, withdrawBalance);
        emit Withdraw(msg.sender, withdrawBalance);
    }
}
