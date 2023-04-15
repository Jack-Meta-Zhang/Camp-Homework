const { ethers } = require("hardhat");

async function main() {
  //部署token
  const TokenTestFactory = await ethers.getContractFactory("TokenTest");
  console.log("TokenTest contract is deploying...");
  const TokenTest = await TokenTestFactory.deploy();
  console.log(`Address is ${TokenTest.address}`);

  //部署vault
  const VaultTestFactory = await ethers.getContractFactory("VaultTest");
  console.log("VaultTest contract is deploying...");
  const VaultTest = await VaultTestFactory.deploy(TokenTest.address);
  console.log(`Address is ${VaultTest.address}`);

  //部署automation
  const AutomationTestFactory = await ethers.getContractFactory(
    "AutomationTest"
  );
  console.log("AutomationTest contract is deploying...");
  const AutomationTest = await AutomationTestFactory.deploy(VaultTest.address);
  console.log(`Address is ${AutomationTest.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
// TokenTest contract is deploying...
// Address is 0xc858675B28378483764D8Ea613b36c4d7048fD8d
// VaultTest contract is deploying...
// Address is 0x2d130b84eB466771baaa0F0B5A6f7ecC9CC98D91
// AutomationTest contract is deploying...
// Address is 0x6A76CC18f60B0715adfCE7941bc1986E9a5F6C9b
