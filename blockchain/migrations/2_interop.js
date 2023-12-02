const KanvasInterop = artifacts.require("KanvasInterop")
const RockPaperScissorsInterop = artifacts.require("RockPaperScissorsInterop")
const StringJoiner = artifacts.require("StringJoiner")
const RockPaperScissors = artifacts.require("RockPaperScissors")

const POLYGON_CCIP_RECEIVER = "0x70499c328e1e2a3c41108bd3730f6670a44595d1";

module.exports = async function (deployer, network, accounts) {
    // return
    // await deployer.deploy(StringJoiner)
    // deployer.link(StringJoiner, KanvasAvax)
    // await deployer.deploy(KanvasInterop, POLYGON_CCIP_RECEIVER)
    // await deployer.deploy(RockPaperScissorsInterop, KanvasInterop.address, RockPaperScissors.address)
};