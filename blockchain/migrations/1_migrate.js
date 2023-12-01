const KanvasAvax = artifacts.require("KanvasAvax")
const RockPaperScissor = artifacts.require("RockPaperScissor")

const AVAX_CCIP_ROUTER = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";

module.exports = async function (deployer, network, accounts) {
    await deployer.deploy(KanvasAvax, AVAX_CCIP_ROUTER)
    await deployer.deploy(RockPaperScissor, KanvasAvax.address)
};