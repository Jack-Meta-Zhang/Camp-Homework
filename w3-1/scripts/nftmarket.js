const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const tokenAddress = "0x061dc51e4163d763e2eb6fdf4ef0798c01488916"
const nftAddress = "0xf509F2ceaCC56a023cc2f3c2423C08F13E657B6E"
async function main() {
    const NftMarketFactory = await ethers.getContractFactory("NftMarket")
    console.log("NftMarket contract is deploying...")
    const NftMarket = await NftMarketFactory.deploy(tokenAddress, nftAddress)
    console.log(`Address is ${NftMarket.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for block confirmations...")
        await NftMarket.deployTransaction.wait(1)
        await verify(NftMarket.address, [tokenAddress, nftAddress])
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
