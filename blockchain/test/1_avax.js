const KanvasAvax = artifacts.require("KanvasAvax")
const RockPaperScissors = artifacts.require("RockPaperScissors")

const fs = require("fs");
const path = require("path");

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

//     it('Create Business Plan', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.createPlan({
//             name: "Business",
//             cost: '5000000000000000000',
//             color: "green",
//             limit: '5000'
//         })

//         console.log(trx.tx)
//     })

//     it('Create Enterprise Plan', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.createPlan({
//             name: "Enterprise",
//             cost: '20000000000000000000',
//             color: "blue",
//             limit: '1000000000000000000'
//         })

//         console.log(trx.tx)
//     })
// })

// contract('KanvasAvax', async accounts => {
//     it('Update Interop', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.updateInterop("12532609583862916517", "0x6DbE734eAD4A25c2d48554df6d4c7196255cE251")

//         console.log(trx.tx)
//     })
// })

// contract('KanvasAvax', async accounts => {
//     it('Update Source Code', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const sourceCode = fs
//             .readFileSync(path.resolve(__dirname, "../../functions/source.js"))
//             .toString()

//         const trx = await kanvas.updateSourceCode(sourceCode)

//         console.log(trx.tx)
//     })
// })


// contract('KanvasAvax', async accounts => {
//     it('Deposit AVAX', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.depositEth({ value: '500000000000000000' })

//         console.log(trx.tx)
//     })
// })






