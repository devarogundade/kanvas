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
//     it('Update Source Code', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const sourceCode = fs
//             .readFileSync(path.resolve(__dirname, "../../functions/source.js"))
//             .toString()

//         const trx = await kanvas.updateSourceCode(sourceCode)

//         console.log(trx.tx)
//     })
// })

contract('KanvasAvax', async accounts => {
    it('Update Gas Limit', async () => {
        const kanvas = await KanvasAvax.deployed()

        const trx = await kanvas.updateGasLimit(300_000)

        console.log(trx.tx)
    })
})

contract('RockPaperScissors', async accounts => {
    it('Test', async () => {
        const kanvas = await KanvasAvax.deployed()

        const trx = await kanvas.test('0x68747470733a2f2f666972656261736573746f726167652e676f6f676c65617069732e636f6d2f76302f622f6b616e7661732d37336139302e61707073706f742e636f6d2f6f2f6d65746164617461732532463078623335326664333462373437646164626633376364353765663734646431393530623666316339312532463078393039643231626165386265306164346433356438393132396232613466323932356461373837372e6a736f6e3f616c743d6d6564696126746f6b656e3d61633862316464652d666330322d346466662d386138332d336536383639346462373337')

        console.log(trx.tx)
    })
})

