let { ethers } = require("hardhat");

async function main() {
  let [owner, second] = await ethers.getSigners();

  let SushiTokenFactory = await ethers.getContractFactory("SushiToken");
  let SushiToken = await SushiTokenFactory.deploy();
  console.log(`SushiToken address is ${SushiToken.address}`);

  let MasterChefFactory = await ethers.getContractFactory("MasterChef");
  let MasterChef = await MasterChefFactory.deploy(
    SushiToken.address,
    second.address,
    ethers.utils.parseUnits("40", 18),
    0,
    0
  );
  console.log(`MasterChef address is ${MasterChef.address}`);

  let MyTokenFactory = await ethers.getContractFactory("MyToken");
  let TokenA = await MyTokenFactory.deploy("A Token", "AT");
  console.log(`TokenA address is ${TokenA.address}`);

  let routerAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  let wethAddr = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  let MyTokenMarketFactory = await ethers.getContractFactory("MyTokenMarket");
  let MyTokenMarket = await MyTokenMarketFactory.deploy(
    TokenA.address,
    routerAddr,
    wethAddr,
    MasterChef.address
  );
  console.log(`MyTokenMarket address is ${MyTokenMarket.address}`);

  //添加流动性
  await TokenA.approve(MyTokenMarket.address, ethers.constants.MaxUint256);
  let aAmount = ethers.utils.parseUnits("1000", 18);
  await MyTokenMarket.addLiquidity(aAmount, {
    value: ethers.utils.parseUnits("100", 18),
  });
  console.log("添加流动性1000tokenA,100eth");

  // let a = await TokenA.balanceOf(owner.address);
  // console.log("持有tokenA:" + ethers.utils.formatUnits(a, 18));

  //masterchef 添加池子
  await MasterChef.add(1, TokenA.address, false);
  console.log("添加MasterChef池子0...");

  //购买token
  const tx3 = await MyTokenMarket.buyToken(ethers.utils.parseUnits("1", 18), {
    value: ethers.utils.parseUnits("1", 18),
  });

  let b2 = await TokenA.balanceOf(MasterChef.address);
  console.log("用1eth购买到tokenA:" + ethers.utils.formatUnits(b2, 18));
  //提取sushi
  await MyTokenMarket.withdraw(b2.toString());
  console.log("从池子中提取代币...");
  let s = await SushiToken.balanceOf(MyTokenMarket.address);
  console.log("Market持有sushi代币数量:" + ethers.utils.formatUnits(s, 18));

  let a2 = await TokenA.balanceOf(MyTokenMarket.address);
  console.log("Market持有tokenA:" + ethers.utils.formatUnits(a2, 18));
  let b = await TokenA.balanceOf(owner.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// SushiToken address is 0x44863F234b137A395e5c98359d16057A9A1fAc55
// MasterChef address is 0x0c03eCB91Cb50835e560a7D52190EB1a5ffba797
// TokenA address is 0x1c39BA375faB6a9f6E0c01B9F49d488e101C2011
// MyTokenMarket address is 0xb04CB6c52E73CF3e2753776030CE85a36549c9C2
// 添加流动性tokenA:1000.0
// 添加流动性eth:100.0
// 添加MasterChef池子0...
// 用1eth购买到tokenA:9.871580343970612988
// 从池子中提取代币...
// Market持有sushi代币数量:39.99999999999999999
// Market持有tokenA:9.871580343970612988
