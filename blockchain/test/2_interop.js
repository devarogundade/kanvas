const KanvasInterop = artifacts.require("KanvasInterop")
const RockPaperScissorsInterop = artifacts.require("RockPaperScissorsInterop")

const fs = require("fs");
const path = require("path");

// contract('KanvasAvax', async accounts => {
//     it('Update Interop', async () => {
//         const kanvas = await KanvasInterop.deployed()

//         const trx = await kanvas.updateInterop("14767482510784806043", "0x73351AA82c08630b10BCBe4896fdD1c17903b7C4")

//         console.log(trx.tx)
//     })
// })



// contract('KanvasInterop', async accounts => {
//     it('Update Source Code', async () => {
//         const kanvas = await KanvasInterop.deployed()

//         const sourceCode = fs
//             .readFileSync(path.resolve(__dirname, "../../functions/source.js"))
//             .toString()

//         const trx = await kanvas.updateSourceCode(sourceCode)

//         console.log(trx.tx)
//     })
// })

// contract('KanvasAvax', async accounts => {
//     it('Deposit AVAX', async () => {
//         const kanvas = await KanvasInterop.deployed()

//         const trx = await kanvas.depositEth({ value: '100000000000000000' })

//         console.log(trx.tx)
//     })
// })



