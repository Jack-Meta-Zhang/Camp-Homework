const { ethers } = require("ethers")
const fs = require("fs")
const logPath = "src/logs/transferLog.json"

async function parseTransferEvent(event) {
    console.log(event.blockNumber)
    const TransferEvent = new ethers.utils.Interface([
        "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)",
    ])
    let decodedData = TransferEvent.parseLog(event)
    console.log("from:" + decodedData.args.from)
    console.log("to:" + decodedData.args.to)
    console.log("tokenId:" + decodedData.args.tokenId.toString())
    // insert to db
    let data = {
        blockNumber: event.blockNumber,
        from: decodedData.args.from,
        to: decodedData.args.to,
        tokenId: decodedData.args.tokenId.toString(),
    }

    const jsonData = JSON.parse(fs.readFileSync(logPath, "utf8"))
    jsonData.push(data)
    fs.writeFileSync(logPath, JSON.stringify(jsonData))
}

// export default { parseTransferEvent }

module.exports = { parseTransferEvent }
