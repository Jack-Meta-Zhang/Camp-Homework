const { ethers, network } = require("hardhat")
const { verify } = require("../utils/verify")
async function main() {
    const TeacherFactory = await ethers.getContractFactory("Teacher")
    console.log("Teacher Contract is deploying...")
    const Teacher = await TeacherFactory.deploy()
    console.log(`Address is ${Teacher.address}`)

    const developmentChains = ["hardhat", "localhost"]

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        console.log("Waiting for block confirmations...")
        await Teacher.deployTransaction.wait(1)
        await verify(Teacher.address, [])
    }
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
