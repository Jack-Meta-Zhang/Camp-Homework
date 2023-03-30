const { ethers } = require("ethers")

const FeiNftABI = require(`../deployments/abi/FeiNft-abi.json`)
const FeiNftAddr = require(`../deployments/address/FeiNft.json`)

async function main() {
    let provider = new ethers.providers.WebSocketProvider(
        "ws://matic-mumbai.chainstacklabs.com"
    )
    let FeiNft = new ethers.Contract(FeiNftAddr.address, FeiNftABI, provider)

    let filter = FeiNft.filters.Transfer()

    provider.on(filter, (event) => {
        console.log(event)
        parseTransferEvent(event)
    })
}

main()
