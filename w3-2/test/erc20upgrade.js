const { expect } = require("chai")
const { ethers } = require("hardhat")

const AMOUNT = ethers.utils.parseEther("1")

describe("erc20upgrade", function () {
    it("works", async () => {
        const ERC20ProxyFactory = await ethers.getContractFactory("ERC20Proxy")
        const ERC20V1Factory = await ethers.getContractFactory("ERC20V1")
        const ERC20V2Factory = await ethers.getContractFactory("ERC20V2")

        //测试合约
        const TestBankFactory = await ethers.getContractFactory("TestBank")
        const TestBankV2Factory = await ethers.getContractFactory("TestBankV2")
        const TestBank = await TestBankFactory.deploy()
        const TestBankV2 = await TestBankV2Factory.deploy()

        //代理合约
        const ERC20Proxy = await upgrades.deployProxy(ERC20ProxyFactory)
        //逻辑合约
        const ERC20V1 = await upgrades.upgradeProxy(
            ERC20Proxy.address,
            ERC20V1Factory
        )

        const tx1 = await ERC20V1.initialize("Fei Token", "FT")
        await tx1.wait(1)
        expect(await ERC20V1.symbol()).to.equal("FT")

        await ERC20V1.transfer(TestBank.address, AMOUNT)
        console.log(1)
        //升级合约
        const ERC20V2 = await upgrades.upgradeProxy(
            ERC20Proxy.address,
            ERC20V2Factory
        )
        //转账失败  TestBank不能接受token
        await expect(ERC20V2.transferWithCallback(TestBank.address, AMOUNT)).to
            .be.reverted
        console.log(2)
        //转账成功  TestBankV2有回调可以接收token
        const tx2 = await ERC20V2.transferWithCallback(
            TestBankV2.address,
            AMOUNT
        )
        await tx2.wait(1)
        console.log(3)
    })
})
