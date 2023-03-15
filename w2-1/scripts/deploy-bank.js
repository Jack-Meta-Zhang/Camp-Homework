const {ethers} = require('hardhat')
const { verify } = require("../utils/verify")

async function main(){
    const BankFactory = await ethers.getContractFactory("Bank");
    console.log("Bank Contract is deploying...");
    const Bank = await BankFactory.deploy({gasLimit: 3000000});
    console.log(`Bank contract address is : ${Bank.address}`);


    const developmentChains = ["hardhat", "localhost"];

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for block confirmations...")
        await Bank.deployTransaction.wait(1)
        await verify(Bank.address, [])
    }
}

main().catch(e=>{
    console.log(e);
    process.exitCode = 1;
})
