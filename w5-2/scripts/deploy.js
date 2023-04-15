let { ethers } = require("hardhat");

async function main() {
  let [owner, second] = await ethers.getSigners();

  let UniswapV2FactoryFactory = await ethers.getContractFactory(
    "UniswapV2Factory"
  );
  let UniswapV2Factory = await UniswapV2FactoryFactory.deploy(owner.address);
  console.log(`UniswapV2Factory address is ${UniswapV2Factory.address}`);

  // let UniswapV2PairFactory = await ethers.getContractFactory("UniswapV2Pair");
  // let UniswapV2Pair = await UniswapV2PairFactory.deploy();
  // console.log(`UniswapV2Pair address is ${UniswapV2Pair.address}`);

  let WETH9Factory = await ethers.getContractFactory("WETH9");
  let WETH9 = await WETH9Factory.deploy();
  console.log(`WETH9 address is ${WETH9.address}`);

  let UniswapV2Router01Factory = await ethers.getContractFactory(
    "UniswapV2Router01"
  );
  let UniswapV2Router01 = await UniswapV2Router01Factory.deploy(
    UniswapV2Factory.address,
    WETH9.address
  );
  console.log(`UniswapV2Router01 address is ${UniswapV2Router01.address}`);
  console.log("----------------");
  //--------------------
  let MyTokenFactory = await ethers.getContractFactory("MyToken");
  let TokenA = await MyTokenFactory.deploy("A Token", "AT");
  console.log(`TokenA address is ${TokenA.address}`);
  let TokenB = await MyTokenFactory.deploy("B Token", "BT");
  console.log(`TokenB address is ${TokenB.address}`);

  let MyTokenMarketFactory = await ethers.getContractFactory("MyTokenMarket");
  let MyTokenMarket = await MyTokenMarketFactory.deploy(
    UniswapV2Router01.address,
    WETH9.address
  );
  console.log(`MyTokenMarket address is ${MyTokenMarket.address}`);
  console.log("----------------");

  await TokenA.approve(MyTokenMarket.address, ethers.constants.MaxUint256);
  await TokenB.approve(MyTokenMarket.address, ethers.constants.MaxUint256);

  //添加流动性
  let aAmount = ethers.utils.parseUnits("1000", 18);
  let bAmount = ethers.utils.parseUnits("500", 18);
  await MyTokenMarket.AddLiquidity(
    TokenA.address,
    TokenB.address,
    aAmount,
    bAmount
  );
  console.log("添加流动性tokenA:" + ethers.utils.formatUnits(aAmount, 18));
  console.log("添加流动性tokenB:" + ethers.utils.formatUnits(bAmount, 18));

  let pairAddress = await UniswapV2Factory.getPair(
    TokenA.address,
    TokenB.address
  );
  //获取交易池
  let pair = await ethers.getContractAt("UniswapV2Pair", pairAddress);
  console.log(`池子的地址是:${pairAddress}`);
  let lp = await pair.balanceOf(owner.address);
  console.log(lp);
  console.log("添加流动性后lp:" + ethers.utils.formatUnits(lp, 18));
  let reserves = await pair.getReserves();
  let token0 = await pair.token0();
  let reserveA =
    token0 == TokenA
      ? ethers.utils.formatUnits(reserves[0], 18)
      : ethers.utils.formatUnits(reserves[1], 18);
  let reserveB =
    token0 == TokenA
      ? ethers.utils.formatUnits(reserves[1], 18)
      : ethers.utils.formatUnits(reserves[0], 18);
  console.log(`池子中的tokenA:${reserveA}`);
  console.log(`池子中的tokenB:${reserveB}`);
  let b = await TokenB.balanceOf(owner.address);
  console.log("持有tokenB:" + ethers.utils.formatUnits(b, 18));

  //兑换token
  const tx2 = await MyTokenMarket.swapTokensForTokens(
    TokenA.address,
    TokenB.address,
    ethers.utils.parseUnits("500", 18),
    ethers.utils.parseUnits("100", 18)
  );

  // console.log(`用500tokenA去交换tokenB`);
  let b2 = await TokenB.balanceOf(owner.address);
  let c2 = ethers.utils.formatUnits(b2, 18) - ethers.utils.formatUnits(b, 18);
  console.log("用500tokenA交换获得" + c2 + " tokenB");
  console.log("交换后持有tokenB:" + ethers.utils.formatUnits(b2, 18));

  //移除流动性
  await pair.approve(MyTokenMarket.address, ethers.constants.MaxUint256);
  await MyTokenMarket.removeLiquidity(
    TokenA.address,
    TokenB.address,
    lp,
    ethers.utils.parseUnits("500", 18),
    ethers.utils.parseUnits("100", 18),
    pairAddress
  );
  let b4 = await TokenB.balanceOf(owner.address);
  console.log("移除流动性后持有tokenB:" + ethers.utils.formatUnits(b4, 18));
  //eth

  // let ethAmount = ethers.utils.parseUnits("2", 18);
  // let aAmount2 = ethers.utils.parseUnits("1000", 18);
  // await MyTokenMarket.AddLiquidityETH(TokenA.address, aAmount2, {
  //   value: ethAmount,
  // });
  // console.log("添加流动性tokenA:" + ethers.utils.formatUnits(aAmount2, 18));
  // console.log("添加流动性ETH:" + ethers.utils.formatUnits(ethAmount, 18));
  // let pairAddress2 = await UniswapV2Factory.getPair(
  //   TokenA.address,
  //   WETH9.address
  // );
  // //获取交易池
  // let pair2 = await ethers.getContractAt("UniswapV2Pair", pairAddress2);
  // console.log(`池子的地址是:${pairAddress2}`);
  // let reserves2 = await pair2.getReserves();
  // let token02 = await pair2.token0();
  // let reserveA2 =
  //   token02 == TokenA
  //     ? ethers.utils.formatUnits(reserves2[0], 18)
  //     : ethers.utils.formatUnits(reserves2[1], 18);
  // let reserveB2 =
  //   token02 == TokenA
  //     ? ethers.utils.formatUnits(reserves2[1], 18)
  //     : ethers.utils.formatUnits(reserves2[0], 18);
  // console.log(`池子中的tokenA:${reserveA2}`);
  // console.log(`池子中的ETH:${reserveB2}`);
  // let a = await TokenA.balanceOf(owner.address);
  // console.log("持有tokenA:" + ethers.utils.formatUnits(a, 18));

  // const tx3 = await MyTokenMarket.swapETHForTokens(
  //   TokenA.address,
  //   ethers.utils.parseUnits("100", 18),
  //   { value: ethers.utils.parseUnits("1", 18) }
  // );
  // // console.log(await tx3.wait(1));
  // let a2 = await TokenA.balanceOf(owner.address);
  // let c = ethers.utils.formatUnits(a2, 18) - ethers.utils.formatUnits(a, 18);
  // console.log("用1 eth交换获得" + c + "tokenA");
  // console.log("交换后持有tokenA:" + ethers.utils.formatUnits(a2, 18));
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// 池子的地址是:0xc66A77c4171f89c0958Ac489B2b8A4a9C0eD91cf
// BigNumber { value: "707106781186547523400" }
// 添加流动性后lp:707.1067811865475234
// 池子中的tokenA:1000.0
// 池子中的tokenB:500.0
// 持有tokenB:9500.0
// 用500tokenA交换获得166.3329996663324 tokenB
// 交换后持有tokenB:9666.332999666332999666
// 0x21915b79e1d334499272521a3508061354d13ff0 0xc66a77c4171f89c0958ac489b2b8a4a9c0ed91cf 707106781186547523400
// 707106781186547523400 23
// 移除流动性后持有tokenB:9999.999999999999999528
