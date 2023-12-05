const KanvasAvax = artifacts.require("KanvasAvax")
const StringJoiner = artifacts.require("StringJoiner")
const RockPaperScissors = artifacts.require("RockPaperScissors")

const AVAX_CCIP_RECEIVER = "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
const AVAX_FUNC_ORACLE = "0xA9d587a00A31A52Ed70D6026794a8FC5E2F5dCb0";

module.exports = async function (deployer, network, accounts) {
    // return
    // await deployer.deploy(StringJoiner)
    deployer.link(StringJoiner, KanvasAvax)
    await deployer.deploy(KanvasAvax, AVAX_CCIP_RECEIVER, AVAX_FUNC_ORACLE)
    await deployer.deploy(RockPaperScissors, KanvasAvax.address)
};