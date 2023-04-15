let { ethers } = require("hardhat");

async function main() {
  let [owner, second] = await ethers.getSigners();

  let TestFactory = await ethers.getContractFactory("Test");
  let Test = await TestFactory.deploy();
  console.log(`Test address is ${Test.address}`);

  const tx = await Test.calculateHash();
  console.log(tx);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//b252dfe29f09ae4ab3315c09b0b51d5617803cf0fbc3d7197bdd1edcd1df9987
//96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f
