//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

interface IScore {
    function setScore(
        address teacher,
        address student,
        uint subjectNo,
        uint score
    ) external;

    function checkScore(
        address _addr,
        uint _subjectNo
    ) external view returns (uint);
}

contract Teacher {
    IScore private scoreContract;
    // address private immutable scoreAddress;
    mapping(address => bool) public isTeacher;

    address public admin;

    event AddTeacher(address indexed admin, address indexed teacher);
    event RemoveTeacher(address indexed admin, address indexed teacher);
    event ChangeAdmin(address indexed admin, address indexed newAdmin);
    event SetScoreContract(address admin, address scoreContract);

    modifier onlyTeacher() {
        require(isTeacher[msg.sender], "not teacher");
        _;
    }
    modifier onlyAdmin() {
        require(msg.sender == admin, "not admin");
        _;
    }

    constructor() {
        isTeacher[msg.sender] = true;
        admin = msg.sender;
        //在这里创建学生合约就没必要用到接口
        // scoreContract = new Score();
    }

    //不在构造函数传入，也不在构造函数创建学生合约，可以升级学生合约
    function setScoreContract(address _addr) external onlyAdmin {
        scoreContract = IScore(_addr);
        emit SetScoreContract(msg.sender, _addr);
    }

    function setStudentScore(
        address _addrStu,
        uint _subjectNo,
        uint _score
    ) external onlyTeacher {
        scoreContract.setScore(msg.sender, _addrStu, _subjectNo, _score);
    }

    function checkStudentScore(
        address _addr,
        uint _subjectNo
    ) external view returns (uint) {
        uint stuScore = scoreContract.checkScore(_addr, _subjectNo);
        return stuScore;
    }

    //添加老师，管理员
    function addTeacher(address _addr) external onlyAdmin {
        isTeacher[_addr] = true;
        emit AddTeacher(msg.sender, _addr);
    }

    //移除老师，管理员
    function removeTeacher(address _addr) external onlyAdmin {
        delete isTeacher[_addr];
        emit RemoveTeacher(msg.sender, _addr);
    }

    //更换管理员，管理员
    function changeAdmin(address _addr) external onlyAdmin {
        admin = _addr;
        // isTeacher[_addr] = true;//管理员是否一定是老师看业务需求
        emit ChangeAdmin(msg.sender, _addr);
    }

    function getScoreContractAddress() external view returns (address) {
        return address(scoreContract);
    }
}
