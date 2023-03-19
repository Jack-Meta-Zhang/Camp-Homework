//SPDX-License-Identifier:MIT
pragma solidity ^0.8.7;

contract Score {
    //科目由编号代替，学生哪个科目的成绩
    mapping(address => mapping(uint => uint)) private studentToSubjectsToScore;
    address public teacherContract;
    address private immutable owner;

    event SetScore(
        address indexed teacher,
        address indexed student,
        uint subjectNo,
        uint score
    );
    event SetTeacherContract(address indexed owner, address teacherContract);

    modifier onlyTeacherContract() {
        require(msg.sender == teacherContract, "not teacher contract");
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    //管理员设置老师合约的地址，这样可以升级老师合约
    function setTeacherContract(address _addr) external onlyOwner {
        teacherContract = _addr;
        emit SetTeacherContract(msg.sender, _addr);
    }

    //查询分数
    function checkScore(
        address _addr,
        uint _subjectNo
    ) external view returns (uint) {
        uint score = studentToSubjectsToScore[_addr][_subjectNo];
        require(score > 0, "no score");
        return score;
    }

    //修改分数，限定老师合约调用
    function setScore(
        address _addrTeacher,
        address _addrStu,
        uint _subjectNo,
        uint _score
    ) external onlyTeacherContract {
        require(_score <= 100, "invalid score");
        studentToSubjectsToScore[_addrStu][_subjectNo] = _score;
        emit SetScore(_addrTeacher, _addrStu, _subjectNo, _score);
    }
}
