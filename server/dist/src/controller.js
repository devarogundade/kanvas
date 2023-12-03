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
const graph_1 = require("./graph");
const postmark_1 = require("postmark");
// import { create as UploadUri } from 'ipfs-http-client';
const https_1 = __importDefault(require("https"));
const graph = new graph_1.Graph();
class Controller {
    generate(properties, fields, gameId, playerId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('PARAMS', properties, fields, gameId, playerId, templateId);
                const game = yield this.getGame(gameId);
                console.log('GAME', game);
                if (game == null)
                    return "";
                // const imageUri = await this.getImageNftUri(game, properties, fields, playerId, templateId);
                // const Json = {
                //     name: "Some Nft",
                //     description: "About Some Nft",
                //     images: imageUri
                // };
                // console.log(Json);
                return "";
                // const auth = 'Basic ' + Buffer.from(
                //     process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET
                // ).toString('base64');
                // /* Create an instance of the client */
                // const client = UploadUri({
                //     host: 'ipfs.infura.io',
                //     port: 5001,
                //     protocol: 'https',
                //     headers: {
                //         authorization: auth,
                //     }
                // });
                // const result = await client.add(JSON.stringify(Json));
                // return result.path;
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
                    email
                    website
                    creator
                    plan
                    templates {
                        templateUri
                    }
                }
            }
            `);
                console.log(response);
                return response.gameCreated;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getImageNftUri(game, data, data2, playerId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.parseProperties(data);
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
            const svgContents = yield this.readFile(game.templates[templateId].templateUri);
            fields.forEach(field => {
                svg = svgContents.replace(field, '');
            });
            return this.toBase64(svg);
        });
    }
    parseFields(fields) {
        return fields.split(" ");
    }
    parseProperties(fields) {
        return fields.split(",");
    }
    toBase64(svg) {
        return Buffer.from(svg).toString('base64');
    }
    readFile(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = "";
            return new Promise((resolve, reject) => {
                https_1.default.get(uri, {
                    rejectUnauthorized: false
                }, (response) => {
                    if (response.statusCode !== 200) {
                        reject(`Failed to download file. Status code: ${response.statusCode}`);
                        return;
                    }
                    response.on('data', (chunk) => { result += chunk; });
                    response.on('end', () => { resolve(result); });
                }).on('error', (err) => {
                    reject(new Error(`Error downloading file: ${err.message}`));
                });
            });
        });
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
