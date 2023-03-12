const {ethers,network} = require('hardhat');
const {verify} = require('../utils/verify')
async function main(){
    const developmentChains = ["hardhat", "localhost"]
    const CounterFactory = await ethers.getContractFactory("Counter");
    console.log("Counter Contract Deploying...");
    const Counter = await CounterFactory.deploy();
    await Counter.deployed();
    console.log(`Counter Contract Deployed At:${Counter.address}`);

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(Counter.address, [])
    }
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });