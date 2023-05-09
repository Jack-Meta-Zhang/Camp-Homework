const { ethers } = require("hardhat");

async function main() {
  const amount = ethers.utils.parseEther("100");
  let [owner, second] = await ethers.getSigners();

  //gov合约可以参与提案的用户
  let users = [
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  ];
  const GovFactory = await ethers.getContractFactory("Gov");
  const Gov = await GovFactory.deploy(users);
  console.log(`Gov address is ${Gov.address}`);

  const TreasuryFactory = await ethers.getContractFactory("Treasury");
  const Treasury = await TreasuryFactory.deploy(Gov.address);
  console.log(`Treasury address is ${Treasury.address}`);

  //设置金库地址
  await Gov.setTreasuryAddress(Treasury.address);
  //存钱
  await owner.sendTransaction({
    to: Treasury.address,
    value: amount,
  });
  // console.log(await Treasury.getBalance());
  //发起提案 给second转100eth
  await Gov.setProposal(amount, second.address);
  let b1 = await second.getBalance();
  console.log(`提案通过前second的eth:${ethers.utils.formatEther(b1)}`);
  //审批提案
  await Gov.approveProposal(1);
  //有两个人同意就执行提案
  await Gov.connect(second).approveProposal(1);
  let b2 = await second.getBalance();
  console.log(`提案通过后second的eth:${ethers.utils.formatEther(b2)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC","0x70997970C51812dc3A010C7d01b50e0d17dc79C8","0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]

// Gov address is 0x5FbDB2315678afecb367f032d93F642f64180aa3
// Treasury address is 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
// 提案通过前second的eth:10000.0
// 提案通过后second的eth:10099.999920136326685184
