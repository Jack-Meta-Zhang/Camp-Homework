//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TestBankV2 {
    mapping(address => uint) balanceOf;

    function tokensReceived(
        address _sender,
        uint amount
    ) external returns (bool) {
        balanceOf[_sender] += amount;
        return true;
    }

    function withdraw(address _token) external {
        uint value = balanceOf[msg.sender];
        require(value > 0, "no token");
        delete balanceOf[msg.sender];
        IERC20(_token).transferFrom(address(this), msg.sender, value);
    }
}
