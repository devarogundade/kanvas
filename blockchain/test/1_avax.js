const KanvasAvax = artifacts.require("KanvasAvax")
const RockPaperScissors = artifacts.require("RockPaperScissors")

const fs = require('fs');

// contract('KanvasAvax', async accounts => {
//     it('Create Starter Plan', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.createPlan({
//             name: "Starter",
//             cost: '0',
//             color: "red",
//             limit: '500'
//         })

//         console.log(trx.tx)
//     })

// it('Create Business Plan', async () => {
//     const kanvas = await KanvasAvax.deployed()

//     const trx = await kanvas.createPlan({
//         name: "Business",
//         cost: '5000000000000000000',
//         color: "green",
//         limit: '5000'
//     })

//     console.log(trx.tx)
// })

// it('Create Enterprise Plan', async () => {
//     const kanvas = await KanvasAvax.deployed()

//     const trx = await kanvas.createPlan({
//         name: "Enterprise",
//         cost: '20000000000000000000',
//         color: "blue",
//         limit: '1000000000000000000'
//     })

//     console.log(trx.tx)
// })
// })

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

// contract('KanvasAvax', async accounts => {
//     it('Update Gas Limit', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.updateGasLimit(300_000)

//         console.log(trx.tx)
//     })
// })


contract('RockPaperScissors', async accounts => {
    it('Create Player', async () => {
        const rockPaperScissors = await RockPaperScissors.deployed()

        const trx = await rockPaperScissors.createPlayer(accounts[0], 'Ibrahim')

        console.log(trx.tx)
    })
})

