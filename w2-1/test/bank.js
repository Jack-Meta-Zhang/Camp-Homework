const {ethers} = require('hardhat')
const {expect,assert} = require('chai')

describe("Bank",()=>{

    const fundFee = ethers.utils.parseEther("0.01");
    async function deployBankFixture(){
        const BankFactory = await ethers.getContractFactory("Bank");
        const Bank = await BankFactory.deploy();
        const [owner, otherAccount] = await ethers.getSigners();

        return {Bank,owner,otherAccount};
    }

    it("deposit to the bank",async ()=>{
        const {Bank} = await deployBankFixture()
        const tx = await Bank.deposit({value:fundFee})
        await tx.wait(1)
        const balance = await Bank.getBalance()
        //存款打入合约
        assert.equal(balance.toString(),fundFee.toString())
    })
    it("record the deposit",async ()=>{
        const {Bank,otherAccount} = await deployBankFixture()
        console.log(1)
        const tx = await Bank.deposit({value:fundFee})
        await tx.wait(1)
        const other =  Bank.connect(otherAccount)
        const tx2 = await other.deposit({value:fundFee})
        await tx2.wait(1)
        const tx3= await other.deposit({value:fundFee})
        await tx3.wait(1)

        const funderNumber = await Bank.getUserNumber();
        //2个人存款3次
        assert.equal(funderNumber,2)
    })

    describe("withdraw",()=>{
        it("no deposit can not withdraw",async ()=>{
            const {Bank,otherAccount} = await deployBankFixture()
            const other =  Bank.connect(otherAccount)
            await expect( other.withdraw()).to.be.revertedWith("no money in bank")
        })

        it("withdraw the deposit",async()=>{
            const {Bank} = await deployBankFixture()
            const tx = await Bank.deposit({value:fundFee})
            await tx.wait(1)

            const balance = await Bank.getBalance()
            expect(balance.toString()).to.equal(fundFee.toString())
            console.log(balance,1)
            const tx4 = await Bank.withdraw()
            await tx4.wait(1)
            const balance2 = await Bank.getBalance()
            console.log(balance,2)
            //取完钱存款为0
            expect(balance2).to.equal(0)
        })
    })
})