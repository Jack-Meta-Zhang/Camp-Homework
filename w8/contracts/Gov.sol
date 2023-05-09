// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

interface Itreasury {
    function withdraw(address to, uint amount) external;
}

contract Gov {
    address public immutable owner;
    address public treasuryAddress;
    address[] public users;
    mapping(address => bool) public isUser;
    uint public constant requireNumber = 2;
    uint public id;

    struct Proposal {
        address creator;
        uint pid;
        uint timestamp;
        uint amount;
        address to;
        uint passNumber;
    }
    mapping(uint => Proposal) public idToProposal;
    mapping(uint => mapping(address => bool)) isUserApproved;

    constructor(address[] memory _users) {
        owner = msg.sender;
        setUser(_users);
    }

    function setUser(address[] memory _users) private {
        uint len = _users.length;
        require(len >= requireNumber && len < 5, "invalid user length");
        for (uint i = 0; i < len; i++) {
            require(!isUser[_users[i]], "user repeated");
            isUser[_users[i]] = true;
        }
        users = _users;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function setTreasuryAddress(address _addr) external onlyOwner {
        treasuryAddress = _addr;
    }

    function setProposal(uint _amount, address _to) external {
        require(isUser[msg.sender], "not user");
        Proposal memory pr = Proposal(
            msg.sender,
            ++id,
            block.timestamp + 1 days,
            _amount,
            _to,
            0
        );
        idToProposal[id] = pr;
    }

    function approveProposal(uint _id) external {
        require(isUser[msg.sender], "not user");
        Proposal storage pr = idToProposal[_id];
        require(pr.amount > 0, "invalid id");
        require(pr.timestamp > block.timestamp, "is timeout");

        require(!isUserApproved[_id][msg.sender], "is approved");
        if (pr.passNumber >= 1) {
            Itreasury(treasuryAddress).withdraw(pr.to, pr.amount);
            delete idToProposal[_id];
        } else {
            isUserApproved[_id][msg.sender] = true;
            pr.passNumber += 1;
        }
    }
}
//["0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2","0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db","0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"]
