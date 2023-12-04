const KanvasAvax = artifacts.require("KanvasAvax")
const RockPaperScissors = artifacts.require("RockPaperScissors")

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

