// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NftMarket {
    IERC20 private immutable token;
    IERC721 private immutable nft;
    mapping(uint => uint) public nftToAmount;
    mapping(uint => address) private tokenIdToOwner;

    event ListNft(address indexed seller, uint indexed tokenId, uint amount);
    event BuyNft(address indexed buyer, uint indexed tokenid);

    constructor(address _token, address _nft) {
        token = IERC20(_token);
        nft = IERC721(_nft);
    }

    function listNft(uint _tokenId, uint amount) external {
        //把nft锁进来，不需要判断，需要提前授权nft
        nft.transferFrom(msg.sender, address(this), _tokenId);
        nftToAmount[_tokenId] = amount;
        tokenIdToOwner[_tokenId] = msg.sender;
        emit ListNft(msg.sender, _tokenId, amount);
    }

    function buyNft(uint _tokenId, uint amount) external {
        uint value = nftToAmount[_tokenId];
        require(value > 0, "invalid tokenid");
        require(value == amount, "invalid amount");
        //先清除mapping
        nftToAmount[_tokenId] = 0;
        //转钱给卖方，需要提前授权token
        token.transferFrom(msg.sender, tokenIdToOwner[_tokenId], amount);
        //转nft给买方
        nft.transferFrom(address(this), msg.sender, _tokenId);
        emit BuyNft(msg.sender, _tokenId);
    }
}
