const { ethers } = require("hardhat");

async function main() {
  const amount = ethers.utils.parseEther("100");
  let [owner, second] = await ethers.getSigners();

  const DeflationTokenFactory = await ethers.getContractFactory(
    "DeflationToken"
  );
  const DeflationToken = await DeflationTokenFactory.deploy();
  console.log(`DeflationToken address is ${DeflationToken.address}`);

  console.log("转给second 100 代币");
  await DeflationToken.transfer(second.address, amount);
  let b1 = await DeflationToken.balanceOf(second.address);
  console.log(`second 代币数量: ${ethers.utils.formatEther(b1)}`);
  await DeflationToken.rebase(1);
  let b2 = await DeflationToken.balanceOf(second.address);
  console.log(`通缩1%后 second 代币数量: ${ethers.utils.formatEther(b2)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// 转给second 100 代币
// second 代币数量: 100.0
// 通缩1%后 second 代币数量: 99.0
