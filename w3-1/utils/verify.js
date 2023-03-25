const { run } = require("hardhat")

const verify = async function (contractAddress, args) {
    console.log("Verifying Contracts....")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("already verified")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }