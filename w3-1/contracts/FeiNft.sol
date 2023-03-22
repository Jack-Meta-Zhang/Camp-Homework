// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract FeiNft is ERC721URIStorage {
    uint private tokenCount;
    string[] private tokenUris;

    constructor() ERC721("Fei NFT", "FNFT") {
        tokenCount = 0;
        tokenUris = [
            "ipfs://QmWcMUAKFfAXg8WXuebiTzku4R6J1DuzvkoRuev1Si6uYy",
            "ipfs://QmeKAuytRxVrxDGbuqVTxqCHm4zoAocK3mRgs6px8SCV9e"
        ];
    }

    function mintNft() external returns (uint) {
        uint newTokenId = tokenCount;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, getUri());
        tokenCount += 1;
        return newTokenId;
    }

    function getCount() external view returns (uint) {
        return tokenCount;
    }

    function getUri() private view returns (string memory) {
        uint randomIndex = uint(
            keccak256(
                abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)
            )
        ) % tokenUris.length;
        return tokenUris[randomIndex];
    }

    //可以添加新的nft元素
    // function addTokenUri(string memory newUri) external onlyOwner{
    //     tokenUris.push(newUri);
    // }
}
