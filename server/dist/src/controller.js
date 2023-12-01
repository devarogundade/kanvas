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
exports.Controller = void 0;
const web3_1 = __importDefault(require("web3"));
const graph_1 = require("./graph");
const postmark_1 = require("postmark");
const ipfs_http_client_1 = require("ipfs-http-client");
const graph = new graph_1.Graph();
class Controller {
    generate(properties, fields, gameId, playerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield this.getGame(gameId);
                if (game == null)
                    return "";
                const Json = {
                    name: "Some Nft",
                    description: "About Some Nft",
                    images: this.getImageNftUri(game, properties, fields, playerId)
                };
                const auth = 'Basic ' + Buffer.from(process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET).toString('base64');
                /* Create an instance of the client */
                const client = (0, ipfs_http_client_1.create)({
                    host: 'ipfs.infura.io',
                    port: 5001,
                    protocol: 'https',
                    headers: {
                        authorization: auth,
                    }
                });
                const result = yield client.add(JSON.stringify(Json));
                return result.path;
            }
            catch (error) {
                console.error(error);
                return "";
            }
        });
    }
    getGame(gameId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield graph.makeRequest(`
            {
                gameCreated(id: "${gameId}") {
                    id
                    gameId
                    name
                    description
                    avatar
                    plan
                    creator
                    email
                    templates
                }
            }
            `);
                return response.gameCreated;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getImageNftUri(game, data, data2, playerId) {
        const web3 = new web3_1.default();
        const properties = web3.eth.abi.decodeParameters(['string[]'], data);
        console.log('PROPERTIES: ' + properties);
        const fields = this.parseFields(data2);
        console.log('FIELDS: ' + properties);
        if (properties.length != fields.length) {
            this.sendEmail("Failed to generate NFT URI", `
                    <ul>
                        <li>Game: ${game.name}</li>
                        <li>Player Id: ${playerId}</li>
                        <li>Reason: The length of your properties and fields are not equal.</li>
                    </ul>
                `, game.email, process.env.POSTMARK_FROM);
            return "";
        }
        let svg = "";
        fields.forEach(field => {
            svg = game.templates[0].replace(field, '');
        });
        return this.toBase64(svg);
    }
    parseFields(fields) {
        return fields.split(" ");
    }
    toBase64(svg) {
        return Buffer.from(svg).toString('base64');
    }
    sendEmail(title, text, to, from) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = {
                To: to,
                From: from,
                Subject: title,
                HtmlBody: text,
                TrackOpens: true,
                MessageStream: "broadcast"
            };
            const client = new postmark_1.Client(process.env.POSTMARK_TOKEN);
            yield client.sendEmail(message);
        });
    }
    ;
}
exports.Controller = Controller;
