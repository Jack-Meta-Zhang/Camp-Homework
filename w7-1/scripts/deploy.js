const { ethers } = require("hardhat");

async function main() {
  const amount = ethers.utils.parseEther("0.01");
  let [owner, second] = await ethers.getSigners();

  const MyTokenFactory = await ethers.getContractFactory("MyToken");
  const MyToken = await MyTokenFactory.deploy("MY TOKEN", "MT");
  console.log(`MyToken address is ${MyToken.address}`);

  const CallOptionFactory = await ethers.getContractFactory("CallOption");
  const CallOption = await CallOptionFactory.deploy(MyToken.address);
  console.log(`CallOption address is ${CallOption.address}`);

  //购买期权0.01eth 2天后用1eth可以买3000token
  await CallOption.buyOption({ value: amount });
  console.log("花了0.01eth购买期权，2天后可以用1eth购买3000token");
  await MyToken.transfer(CallOption.address, ethers.utils.parseEther("5000"));
  let b1 = await MyToken.balanceOf(owner.address);
  console.log(`当前token数量:${ethers.utils.formatEther(b1)}`);
  //更改时间
  await CallOption.addTime();
  //行权
  await CallOption.excOption({ value: ethers.utils.parseEther("1") });
  let b2 = await MyToken.balanceOf(owner.address);
  console.log(`行权后token数量:${ethers.utils.formatEther(b2)}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// MyToken address is 0x44863F234b137A395e5c98359d16057A9A1fAc55
// CallOption address is 0x0c03eCB91Cb50835e560a7D52190EB1a5ffba797
// 花了0.01eth购买期权，2天后可以用1eth购买3000token
// 当前token数量:5000.0
// 行权后token数量:8000.0
