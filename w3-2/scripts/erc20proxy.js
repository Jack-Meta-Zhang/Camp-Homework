const { ethers, upgrades } = require("hardhat")

async function main() {
    const ERC20ProxyFactory = await ethers.getContractFactory("ERC20Proxy")
    console.log("ERC20Proxy contract is deploying...")
    const ERC20Proxy = await upgrades.deployProxy(ERC20ProxyFactory)
    console.log(`Address is :${ERC20Proxy.address}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
