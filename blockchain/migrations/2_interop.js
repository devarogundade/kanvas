const StringJoiner = artifacts.require("StringJoiner")
const KanvasInterop = artifacts.require("KanvasInterop")
const RockPaperScissorsInterop = artifacts.require("RockPaperScissorsInterop")

const POLYGON_CCIP_RECEIVER = "0x70499c328e1e2a3c41108bd3730f6670a44595d1";
const POLYGON_FUNC_ORACLE = "0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C";

module.exports = async function (deployer, network, accounts) {
    return
    await deployer.deploy(StringJoiner)
    deployer.link(StringJoiner, KanvasInterop)
    await deployer.deploy(KanvasInterop, POLYGON_CCIP_RECEIVER, POLYGON_FUNC_ORACLE)
    await deployer.deploy(RockPaperScissorsInterop, KanvasInterop.address, "0x2c5b41441F3779EacfA9ce75BAa3B543f750DF61")
};