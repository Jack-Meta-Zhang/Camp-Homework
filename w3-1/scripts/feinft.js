const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

async function main() {
    const FeiNftFactory = await ethers.getContractFactory("FeiNft")
    console.log("FeiNft contract is deploying...")
    const FeiNft = await FeiNftFactory.deploy()
    console.log(`Address is ${FeiNft.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for block confirmations...")
        await FeiNft.deployTransaction.wait(1)
        await verify(FeiNft.address, [])
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
