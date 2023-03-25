const { ethers, upgrades } = require("hardhat")

async function main() {
    const ERC20V2Factory = await ethers.getContractFactory("ERC20V2")
    console.log("ERC20V2 contract is deploying...")
    const ERC20V2 = await upgrades.upgradeProxy(
        "0xaa25392effecb63ff9292cd677359f5a85131a2d",
        ERC20V2Factory
    )
    console.log(`Address is :${ERC20V2.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
