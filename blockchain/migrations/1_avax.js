const KanvasAvax = artifacts.require("KanvasAvax")
const RockPaperScissors = artifacts.require("RockPaperScissors")
const StringJoiner = artifacts.require("StringJoiner")

const AVAX_CCIP_RECEIVER = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";

module.exports = async function (deployer, network, accounts) {
    return
    await deployer.deploy(StringJoiner)
    deployer.link(StringJoiner, KanvasAvax)
    await deployer.deploy(KanvasAvax, AVAX_CCIP_RECEIVER)
    await deployer.deploy(RockPaperScissors, KanvasAvax.address)
};