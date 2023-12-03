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
const https_1 = __importDefault(require("https"));
const graph_1 = require("./graph");
const postmark_1 = require("postmark");
const app_1 = require("firebase-admin/app");
const storage_1 = require("firebase-admin/storage");
const kanvas_creds_json_1 = __importDefault(require("../kanvas-creds.json"));
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(kanvas_creds_json_1.default),
    storageBucket: 'kanvas-73a90.appspot.com'
});
const bucket = (0, storage_1.getStorage)().bucket();
const graph = new graph_1.Graph();
class Controller {
    generate(properties, fields, gameId, playerId, templateId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const game = yield this.getGame(gameId);
                if (game == null) {
                    this.sendEmail("Kanvas: Critical Error", `
                            <ul>
                                <li>Game Id: ${gameId}</li>
                                <li>Player Id: ${playerId}</li>
                                <li>Template Id: ${templateId}</li>
                                <li>Reason: Game was not found!.</li>
                            </ul>
                        `, process.env.DEV_EMAIL, process.env.POSTMARK_FROM);
                    return "";
                }
                ;
                const buffer = yield this.getImageNftUri(game, properties, fields, playerId, templateId);
                if (buffer == null) {
                    this.sendEmail(`${game.name} Failed to generate NFT URI`, `
                        <ul>
                            <li>Game: ${game.name}</li>
                            <li>Player Id: ${playerId}</li>
                            <li>Reason: Failed to generate Nft Uri.</li>
                        </ul>
                    `, game.email, process.env.POSTMARK_FROM);
                    return "";
                }
                ;
                const path = `generated/${game.gameId}/${playerId}.svg`;
                yield bucket.file(path).save(buffer, {
                    public: true
                });
                const downloadURL = yield (0, storage_1.getDownloadURL)(bucket.file(path));
                this.sendEmail(`Kanvas: New NFT URI generated on ${game.name}`, `
                        <ul>
                            <li>Game: ${game.name}</li>
                            <li>Player Id: ${playerId}</li>
                            <li>URI: ${downloadURL}</li>
                            <li>Reason: Failed to generate Nft Uri.</li>
                        </ul>
                    `, game.email, process.env.POSTMARK_FROM);
                const Metadata = {
                    name: game.name,
                    description: game.description,
                    images: downloadURL
                };
                return JSON.stringify(Metadata);
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
            const fields = this.parseFields(data2);
            if (properties.length != fields.length) {
                this.sendEmail("Failed to generate NFT URI", `
                    <ul>
                        <li>Game: ${game.name}</li>
                        <li>Player Id: ${playerId}</li>
                        <li>Reason: The length of your properties and fields are not equal.</li>
                    </ul>
                `, game.email, process.env.POSTMARK_FROM);
                return null;
            }
            try {
                const buffer = yield this.readFile(game.templates[templateId].templateUri);
                const svgContents = new TextDecoder('utf-8').decode(buffer);
                let svgString = "";
                for (let index = 0; index < properties.length; index++) {
                    svgString = svgContents.replace(fields[index], properties[index]);
                }
                return Buffer.from(svgString, 'utf-8');
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    parseFields(fields) {
        return fields.split(" ").filter(prop => prop.trim() !== '');
    }
    parseProperties(fields) {
        return fields.split(",").filter(prop => prop.trim() !== '');
    }
    readFile(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let chunks = Buffer.alloc(0);
            return new Promise((resolve, reject) => {
                https_1.default.get(uri, {
                    rejectUnauthorized: false
                }, (response) => {
                    if (response.statusCode !== 200) {
                        reject(`Failed to download file. Status code: ${response.statusCode}`);
                        return;
                    }
                    response.on('data', (chunk) => {
                        chunks = Buffer.concat([chunks, chunk]);
                    });
                    response.on('end', () => {
                        resolve(chunks);
                    });
                }).on('error', (err) => {
                    reject(new Error(`Error downloading file: ${err.message}`));
                });
            });
        });
    }
    sendEmail(title, text, to, from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    ;
}
exports.Controller = Controller;
