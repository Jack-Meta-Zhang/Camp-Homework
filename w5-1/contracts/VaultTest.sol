// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//0xbaaf7CA46f6E1E734d1888553B3A8F47613D02e6
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract VaultTest {
    mapping(address => uint) public deposited;
    address public immutable token;
    address owner;

    event Deposit(address indexed user, uint amount);
    event Withdraw(address indexed user, uint amount);

    constructor(address _token) {
        token = _token;
        owner = msg.sender;
    }

    function deposit(address user, uint amount) public {
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer from error"
        );
        deposited[user] += amount;
        emit Deposit(user, amount);
    }

    function permitDeposit(
        address user,
        uint amount,
        uint deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        IERC20Permit(token).permit(
            msg.sender,
            address(this),
            amount,
            deadline,
            v,
            r,
            s
        );
        deposit(user, amount);
    }

    function collect() external {
        if (IERC20(token).balanceOf(address(this)) > 100e18) {
            SafeERC20.safeTransfer(IERC20(token), owner, 100e18);
        }
    }

    function withdraw(address _addr, uint _amount) external {
        uint amount = deposited[_addr];
        require(amount >= _amount, "not enough deposited");
        SafeERC20.safeTransfer(IERC20(token), _addr, _amount);
        deposited[_addr] = amount - _amount;
        emit Withdraw(_addr, _amount);
    }

    // function autoWithdraw(address _addr) external{
    //     uint amount = deposited[_addr];
    //     if(amount > 2e18){
    //         uint withdrawAmount = amount/2;
    //         SafeERC20.safeTransfer(IERC20(token), _addr, withdrawAmount);
    //         deposited[_addr] = amount - withdrawAmount;
    //     }

    // }

    // function withdraw2() external {
    //     uint amount = deposited[msg.sender];
    //     SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
    //     deposited[msg.sender] = 0;
    // }
}
