const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

async function main() {
    const FeiTokenFactory = await ethers.getContractFactory("FeiToken")
    console.log("FeiToken contract is deploying...")
    const FeiToken = await FeiTokenFactory.deploy()
    console.log(`Address is ${FeiToken.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for block confirmations...")
        await FeiToken.deployTransaction.wait(1)
        await verify(FeiToken.address, [])
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
