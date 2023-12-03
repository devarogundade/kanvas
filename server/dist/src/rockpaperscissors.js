"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RockPaperScissorsController = void 0;
const web3_1 = __importDefault(require("web3"));
const RockPaperScissors_json_1 = __importDefault(require("./abis/RockPaperScissors.json"));
const Rpcs = {
    43113: 'https://avalanche-fuji-c-chain.publicnode.com',
    80001: 'https://polygon-mumbai-bor.publicnode.com'
};
const privateKey = process.env.EVM_PRIVATE_KEY;
class RockPaperScissorsController {
    upgradePlayer(chainId, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const web3 = new web3_1.default(Rpcs[chainId]);
                let contract;
                if (chainId == 43113) {
                    contract = new web3.eth.Contract(RockPaperScissors_json_1.default.abi, RockPaperScissors_json_1.default.networks[chainId].address);
                }
                else {
                    return null;
                    // contract = new web3.eth.Contract((RockPaperScissorsInterop as any).abi, RockPaperScissorsInterop.networks[chainId].address);
                }
                const account = web3.eth.accounts.privateKeyToAccount(privateKey);
                web3.eth.accounts.wallet.add(account);
                const gas = yield contract.methods.upgradePlayer(playerId).estimateGas({
                    from: account.address
                });
                const gasPrice = yield web3.eth.getGasPrice();
                const { transactionHash } = yield contract.methods.upgradePlayer(playerId).send({
                    from: account.address,
                    gasPrice: gasPrice,
                    gas: gas
                });
                return transactionHash;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    downgradePlayer(chainId, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const web3 = new web3_1.default(Rpcs[chainId]);
                let contract;
                if (chainId == 43113) {
                    contract = new web3.eth.Contract(RockPaperScissors_json_1.default.abi, RockPaperScissors_json_1.default.networks[chainId].address);
                }
                else {
                    return null;
                    // contract = new web3.eth.Contract((RockPaperScissorsInterop as any).abi, RockPaperScissorsInterop.networks[chainId].address);
                }
                const account = web3.eth.accounts.privateKeyToAccount(privateKey);
                web3.eth.accounts.wallet.add(account);
                const gas = yield contract.methods.downgradePlayer(playerId).estimateGas({
                    from: account.address
                });
                const gasPrice = yield web3.eth.getGasPrice();
                const { transactionHash } = yield contract.methods.downgradePlayer(playerId).send({
                    from: account.address,
                    gasPrice: gasPrice,
                    gas: gas
                });
                return transactionHash;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
}
exports.RockPaperScissorsController = RockPaperScissorsController;
