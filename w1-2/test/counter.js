const {
    loadFixture,
  } = require("@nomicfoundation/hardhat-network-helpers");
  const { expect,assert} = require("chai");

  describe("Counter",function(){

    async function deployCounterFixture() {
        const [owner, otherAccount] = await ethers.getSigners();
        const CounterFactory = await ethers.getContractFactory("Counter");
        const Counter = await CounterFactory.deploy();
        return { Counter, owner, otherAccount };
      }

      describe("count", function(){

        it("can be call by owner",async function(){
            const { Counter} = await loadFixture(deployCounterFixture);
            let count = await Counter.counter();
            assert.equal(count,1);
            let tx = await Counter.count();
            await tx.wait(1);
            let newCount = await Counter.counter();
            assert.equal(newCount,6);
        })

        it("can not be call by others",async function(){
            const { Counter,otherAccount} = await loadFixture(deployCounterFixture);
            let owner = await Counter.owner();
            let newCounter = await Counter.connect(otherAccount);
            await expect( newCounter.count()).to.be.revertedWith("not owner");
        })
      })
  })