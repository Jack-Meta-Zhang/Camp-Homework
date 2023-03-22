const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

const tokenAddress = "0x061dc51e4163d763e2eb6fdf4ef0798c01488916"
async function main() {
    const VaultFactory = await ethers.getContractFactory("Vault")
    console.log("Vault contract is deploying...")
    const Vault = await VaultFactory.deploy(tokenAddress)
    console.log(`Address is ${Vault.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for block confirmations...")
        await Vault.deployTransaction.wait(1)

        await verify(Vault.address, [tokenAddress])
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
