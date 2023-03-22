const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

const { expect, assert } = require("chai")

describe("Lock", function () {
    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners()
        const FeiTokenFactory = await ethers.getContractFactory("FeiToken")
        const FeiToken = await FeiTokenFactory.deploy()
        const VaultFactory = await ethers.getContractFactory("Vault")
        const Vault = await VaultFactory.deploy(FeiToken.address)
        const FeiNftFactory = await ethers.getContractFactory("FeiNft")
        const FeiNft = await FeiNftFactory.deploy()
        const NftMarketFactory = await ethers.getContractFactory("NftMarket")
        const NftMarket = await NftMarketFactory.deploy(
            FeiToken.address,
            FeiNft.address
        )
        return { FeiToken, Vault, FeiNft, NftMarket, owner, otherAccount }
    }

    describe("feitoken", function () {
        it("initial feitoken", async () => {
            const { FeiToken, owner } = await deployFixture()
            const supply = await FeiToken.totalSupply()
            assert.equal(
                await FeiToken.balanceOf(owner.address).toString(),
                await FeiToken.totalSupply().toString()
            )
        })
    })
    describe("vault", function () {
        it("deposit and withdraw", async () => {
            const { FeiToken, Vault, owner } = await deployFixture()
            const tx1 = await FeiToken.approve(Vault.address, 1000)
            const tx2 = await Vault.deposit(1000)
            await tx2.wait(1)
            assert.equal(await Vault.addressToAmount(owner.address), 1000)
            const tx3 = await Vault.withdraw(500)
            await tx3.wait(1)
            assert.equal(await Vault.addressToAmount(owner.address), 500)
        })
    })

    describe("feinft", function () {
        it("mintNft", async () => {
            const { FeiNft, owner } = await deployFixture()
            const tx = await FeiNft.mintNft()
            await tx.wait(1)
            console.log(await FeiNft.tokenURI(0))
            assert.equal(await FeiNft.ownerOf(0), owner.address)
        })
    })
    describe("nftmarket", function () {
        it("list and buy nft", async () => {
            const { FeiToken, FeiNft, NftMarket, owner, otherAccount } =
                await deployFixture()
            //铸造nft
            const tx = await FeiNft.mintNft()
            await tx.wait(1)
            //授权nft
            const tx2 = await FeiNft.approve(NftMarket.address, 0)
            await tx2.wait(1)
            //上架nft
            const tx3 = await NftMarket.listNft(0, 100)
            await tx3.wait(1)
            //给账号2转token
            const tx4 = await FeiToken.transfer(otherAccount.address, 300)
            await tx4.wait(1)
            //连接账号2
            const account2Token = await FeiToken.connect(otherAccount)
            const account2Market = await NftMarket.connect(otherAccount)
            //授权token
            const tx5 = await account2Token.approve(NftMarket.address, 300)
            await tx5.wait(1)
            //购买nft
            const tx6 = await account2Market.buyNft(0, 100)
            await tx6.wait(1)

            assert.equal(await FeiToken.balanceOf(otherAccount.address), 200)
            assert.equal(await FeiNft.ownerOf(0), otherAccount.address)
        })
    })
})
