const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")
const { expect, assert } = require("chai")

describe("Lock", function () {
    async function deployFixture() {
        const [owner, otherAccount] = await ethers.getSigners()

        const TeacherFactory = await ethers.getContractFactory("Teacher")
        const Teacher = await TeacherFactory.deploy()

        const ScoreFactory = await ethers.getContractFactory("Score")
        const Score = await ScoreFactory.deploy()

        await Teacher.setScoreContract(Score.address)
        await Score.setTeacherContract(Teacher.address)

        return { Teacher, Score, owner, otherAccount }
    }

    describe("teacher", function () {
        it("others can not set score", async () => {
            const { Teacher, otherAccount } = await deployFixture()
            const otherContract = Teacher.connect(otherAccount)
            await expect(
                otherContract.setStudentScore(otherAccount.address, 1, 1)
            ).to.be.revertedWith("not teacher")
        })
        it("teacher can set score", async () => {
            const { Teacher, otherAccount } = await deployFixture()
            await Teacher.addTeacher(otherAccount.address)
            const otherContract = Teacher.connect(otherAccount)
            await otherContract.setStudentScore(otherAccount.address, 1, 99)
            const stuScore = await Teacher.checkStudentScore(
                otherAccount.address,
                1
            )
            assert.equal(stuScore, 99)
        })
    })
    describe("score", function () {
        it("student contract an not set score", async () => {
            const { owner, otherAccount, Score } = await deployFixture()
            console.log(Score.address, 2)
            await expect(
                Score.setScore(owner.address, otherAccount.address, 1, 1)
            ).to.be.revertedWith("not teacher contract")
        })
    })
})
