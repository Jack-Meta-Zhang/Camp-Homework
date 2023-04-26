const { ethers } = require("hardhat");

async function main() {
  const MyTokenAmount = ethers.utils.parseEther("3");
  let [owner, second] = await ethers.getSigners();

  const MyTokenFactory = await ethers.getContractFactory("MyToken");
  const MyToken = await MyTokenFactory.deploy("MY TOKEN", "MT");
  console.log(`MyToken address is ${MyToken.address}`);

  const StakingMiningFactory = await ethers.getContractFactory("StakingMining");
  const StakingMining = await StakingMiningFactory.deploy(MyToken.address);
  console.log(`StakingMining address is ${StakingMining.address}`);

  //质押
  await MyToken.approve(StakingMining.address, ethers.constants.MaxUint256);
  await StakingMining.stake(10, MyTokenAmount);
  //赎回
  await MyToken.transfer(StakingMining.address, ethers.utils.parseEther("100"));
  let b1 = await MyToken.balanceOf(owner.address);
  console.log(
    `质押了3个token，利率10，当前token数量:${ethers.utils.formatEther(b1)}`
  );
  await StakingMining.redeem(10, 0);
  let b2 = await MyToken.balanceOf(owner.address);
  console.log(`赎回后token数量:${ethers.utils.formatEther(b2)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// MyToken address is 0x44863F234b137A395e5c98359d16057A9A1fAc55
// StakingMining address is 0x0c03eCB91Cb50835e560a7D52190EB1a5ffba797
// 质押了3个token，利率10，当前token数量:9897.0
// 赎回后token数量:9930.000011574074074074
