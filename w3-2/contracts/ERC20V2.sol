//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

interface TokenRecipient {
    function tokensReceived(
        address sender,
        uint amount
    ) external returns (bool);
}

contract ERC20V2 is Initializable, ERC20Upgradeable {
    using Address for address;

    function initialize(
        string memory name,
        string memory symbol
    ) public initializer {
        __ERC20_init(name, symbol);
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    function transferWithCallback(
        address recipient,
        uint amount
    ) external returns (bool) {
        if (recipient.isContract()) {
            bool success = TokenRecipient(recipient).tokensReceived(
                msg.sender,
                amount
            );
            require(success, "no receive function");
        }
        return transfer(recipient, amount);
    }
}
