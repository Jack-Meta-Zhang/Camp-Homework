const {ethers} = require('hardhat')
const {expect,assert} = require('chai')

describe("FundMe",()=>{

    const fundFee = ethers.utils.parseEther("0.01");
    async function deployBankFixture(){
        const BankFactory = await ethers.getContractFactory("FundMe");
        const Bank = await BankFactory.deploy();
        const [owner, otherAccount] = await ethers.getSigners();

        return {Bank,owner,otherAccount};
    }

    it("fund to the bank",async ()=>{
        const {Bank} = await deployBankFixture()
        const tx = await Bank.fund({value:fundFee})
        await tx.wait(1)
        const balance = await Bank.getBalance()
        //存款打入合约
        assert.equal(balance.toString(),fundFee.toString())
    })
    it("record the funders",async ()=>{
        const {Bank,otherAccount} = await deployBankFixture()
        const tx = await Bank.fund({value:fundFee})
        await tx.wait(1)
        const other =  Bank.connect(otherAccount)
        const tx2 = await other.fund({value:fundFee})
        await tx2.wait(1)
        const tx3= await other.fund({value:fundFee})
        await tx3.wait(1)

        const funderNumber = await Bank.getFunderNumber();
        //2个人存款3次
        assert.equal(funderNumber,2)
    })

    describe("withdraw",()=>{
        it("others can not withdraw",async ()=>{
            const {Bank,otherAccount} = await deployBankFixture()
            const other =  Bank.connect(otherAccount)
            await expect( other.withdraw()).to.be.revertedWith("not owner")
        })

        it("withdraw the money",async()=>{
            const {Bank,otherAccount,owner} = await deployBankFixture()
            const tx = await Bank.fund({value:fundFee})
            await tx.wait(1)
            const other =  Bank.connect(otherAccount)
            const tx2 = await other.fund({value:fundFee})
            await tx2.wait(1)
            const tx3= await other.fund({value:fundFee})
            await tx3.wait(1)

            const balance = await Bank.getBalance()
            //3个人存款，总共0.03eth
            expect(balance.toString()).to.equal((fundFee*3).toString())

            const tx4 = await Bank.withdraw()
            await tx4.wait(1)
            const balance2 = await Bank.getBalance()
            //取完钱存款为0
            expect(balance2).to.equal(0)
        })
    })
})