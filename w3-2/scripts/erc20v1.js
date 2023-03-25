const { ethers, upgrades } = require("hardhat")

async function main() {
    const ERC20V1Factory = await ethers.getContractFactory("ERC20V1")
    console.log("ERC20V1 contract is deploying...")
    const ERC20V1 = await upgrades.upgradeProxy(
        "0xaa25392effecb63ff9292cd677359f5a85131a2d",
        ERC20V1Factory
    ) //proxy合约地址
    console.log(`Address is :${ERC20V1.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
