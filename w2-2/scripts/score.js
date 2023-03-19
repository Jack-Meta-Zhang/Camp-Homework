const { ethers, network } = require("hardhat")
const { verify } = require("../utils/verify")
async function main() {
    const ScoreFactory = await ethers.getContractFactory("Score")
    console.log("Score Contract is deploying...")
    const Score = await ScoreFactory.deploy()
    console.log(`Address is ${Score.address}`)

    const developmentChains = ["hardhat", "localhost"]

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for block confirmations...")
        await Score.deployTransaction.wait(1)
        await verify(Score.address, [])
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
