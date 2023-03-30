const { ethers } = require("ethers")
const fs = require("fs")

const { parseTransferEvent } = require("../utils/handleEvent")

const FeiNftABI = require(`../deployments/abi/FeiNft-abi.json`)
const FeiNftAddr = require(`../deployments/address/FeiNft.json`)

const logPath = "src/logs/transferLog.json"

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(
        "https://matic-mumbai.chainstacklabs.com"
    )

    let FeiNft = new ethers.Contract(FeiNftAddr.address, FeiNftABI, provider)

    let filter = FeiNft.filters
        .Transfer
        // null,
        // "0x5c54c54e9e152ab3be5f9ea3b9e697fee5c793ea"
        ()
    filter.fromBlock = 33424642
    filter.toBlock = 33424857

    // let events = await myerc20.queryFilter(filter);
    let events = await provider.getLogs(filter)
    fs.writeFileSync(logPath, JSON.stringify([]))
    for (let i = 0; i < events.length; i++) {
        //console.log(events[i]);
        console.log(`-----${i + 1}-----`)
        parseTransferEvent(events[i])
    }
}

main()
//100000000000000000000
//1000000000000000000
