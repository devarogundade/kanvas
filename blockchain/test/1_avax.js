const KanvasAvax = artifacts.require("KanvasAvax")
const RockPaperScissors = artifacts.require("RockPaperScissors")

const fs = require("fs");
const path = require("path");

contract('KanvasAvax', async accounts => {
    it('Create Starter Plan', async () => {
        const kanvas = await KanvasAvax.deployed()

        const trx = await kanvas.createPlan({
            name: "Starter",
            cost: '0',
            color: "red",
            limit: '500'
        })

        console.log(trx.tx)
    })

    it('Create Business Plan', async () => {
        const kanvas = await KanvasAvax.deployed()

        const trx = await kanvas.createPlan({
            name: "Business",
            cost: '5000000000000000000',
            color: "green",
            limit: '5000'
        })

        console.log(trx.tx)
    })

    it('Create Enterprise Plan', async () => {
        const kanvas = await KanvasAvax.deployed()

        const trx = await kanvas.createPlan({
            name: "Enterprise",
            cost: '20000000000000000000',
            color: "blue",
            limit: '1000000000000000000'
        })

        console.log(trx.tx)
    })
})

contract('KanvasAvax', async accounts => {
    it('Update Interop', async () => {
        const kanvas = await KanvasAvax.deployed()

        const trx = await kanvas.updateInterop("12532609583862916517", "0xb9ca17B9D092995C1Fa1D7Cc8BE24FC65733ec8d")

        console.log(trx.tx)
    })
})

contract('KanvasAvax', async accounts => {
    it('Update Source Code', async () => {
        const kanvas = await KanvasAvax.deployed()

        const sourceCode = fs
            .readFileSync(path.resolve(__dirname, "../../functions/source.js"))
            .toString()

        const trx = await kanvas.updateSourceCode(sourceCode)

        console.log(trx.tx)
    })
})

contract('KanvasAvax', async accounts => {
    it('Create Game', async () => {
        const kanvas = await KanvasAvax.deployed()

        const trx = await kanvas.createGame({
            name: 'RockPaperScissors',
            description: 'Just A Game',
            gameId: RockPaperScissors.address,
            avatar: '',
            plan: 1,
            email: 'arogundadeis.20@student.funaab.edu.ng',
            website: ''
        })

        console.log(trx.tx)
    })
})

contract('RockPaperScissors', async accounts => {
    it('Create Player', async () => {
        const rockPaperScissors = await RockPaperScissors.deployed()

        const trx = await rockPaperScissors.createPlayer(accounts[0], 'Ibrahim')

        console.log(trx.tx)
    })
})

contract('RockPaperScissors', async accounts => {
    it('Transfer To', async () => {
        const rockPaperScissors = await RockPaperScissors.deployed()

        const trx = await rockPaperScissors.transferTo("12532609583862916517", {
            value: "100000000000000000"
        })

        console.log(trx.tx)
    })
})


