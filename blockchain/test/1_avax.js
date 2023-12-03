const KanvasAvax = artifacts.require("KanvasAvax")
const RockPaperScissors = artifacts.require("RockPaperScissors")

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

//     // it('Create Business Plan', async () => {
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
//     it('Create RockPaperScissors Game', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.createGame({
//             name: "RockPaperScissors",
//             description: "Play And Earn",
//             gameId: RockPaperScissors.address,
//             avatar: "https://projects-static.raspberrypi.org/projects/rock-paper-scissors/05a38c3b2fa6deb8fe4ccd505b5e7c65bda28e2f/en/images/rock-paper-scissors.png",
//             email: "devarogundade@gmail.com",
//             website: "https://kanvas-constellation.netlity.app/rockpaperscissors",
//             plan: 1
//         })

//         console.log(trx.tx)
//     })
// })

// contract('KanvasAvax', async accounts => {
//     it('Create RockPaperScissors Template', async () => {
//         const kanvas = await KanvasAvax.deployed()

//         const trx = await kanvas.addTemplate(`https://files.kanvas.templates/1.svg`, RockPaperScissors.address)

//         console.log(trx.tx)
//     })
// })

// contract('RockPaperScissors', async accounts => {
//     it('Create RockPaperScissors Player', async () => {
//         const rockPaperScissors = await RockPaperScissors.deployed()

//         const trx = await rockPaperScissors.createPlayer(accounts[0], "Ibrahim")

//         console.log(trx.tx)
//     })
// })

contract('RockPaperScissors', async accounts => {
    it('Create RockPaperScissors Upgrade Player', async () => {
        const rockPaperScissors = await RockPaperScissors.deployed()

        const trx = await rockPaperScissors.upgradePlayer(accounts[0])

        console.log(trx.tx)
    })
})