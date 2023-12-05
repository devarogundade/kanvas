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

//     // it('Create Business Plan', async () => {
//     //     const kanvas = await KanvasAvax.deployed()

//     //     const trx = await kanvas.createPlan({
//     //         name: "Business",
//     //         cost: '5000000000000000000',
//     //         color: "green",
//     //         limit: '5000'
//     //     })

//     //     console.log(trx.tx)
//     // })

//     // it('Create Enterprise Plan', async () => {
//     //     const kanvas = await KanvasAvax.deployed()

//     //     const trx = await kanvas.createPlan({
//     //         name: "Enterprise",
//     //         cost: '20000000000000000000',
//     //         color: "blue",
//     //         limit: '1000000000000000000'
//     //     })

//     //     console.log(trx.tx)
//     // })
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
//     it('Create Game', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.createGame({
//             name: 'RockPaperScissors',
//             description: 'Just A Game',
//             gameId: RockPaperScissors.address,
//             avatar: '',
//             plan: 1,
//             email: 'arogundadeis.20@student.funaab.edu.ng',
//             website: ''
//         })

//         console.log(trx.tx)
//     })
// })

// contract('RockPaperScissors', async accounts => {
//     it('Create Player', async () => {
//         const rockPaperScissors = await RockPaperScissors.deployed()

//         const trx = await rockPaperScissors.createPlayer(accounts[0], 'Ibrahim')

//         console.log(trx.tx)
//     })
// })

// contract('KanvasAvax', async accounts => {
//     it('Set Skip', async () => {
//         const kanvasAvax = await KanvasAvax.deployed()

//         const trx = await kanvasAvax._res()

//         console.log(trx)
//     })
// })

// contract('RockPaperScissors', async accounts => {
//     it('Upgrade Player', async () => {
//         const rockPaperScissors = await RockPaperScissors.deployed()

//         const trx = await rockPaperScissors.upgradePlayer(accounts[0])

//         console.log(trx.tx)
//     })
// })

// contract('RockPaperScissors', async accounts => {
//     it('Upgrade Player', async () => {
//         const rockPaperScissors = await RockPaperScissors.deployed()

//         const trx = await rockPaperScissors._receiveUri(accounts[0], "https://firebasestorage.googleapis.com/v0/b/kanvas-73a90.appspot.com/o/metadatas%2F0xb352fd34b747dadbf37cd57ef74dd1950b6f1c91%2F0x909d21bae8be0ad4d35d89129b2a4f2925da7877.json?alt=media&token=ac8b1dde-fc02-4dff-8a83-3e68694db737")

//         console.log(trx)
//     })
// })


