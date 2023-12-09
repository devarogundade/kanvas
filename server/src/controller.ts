import https from 'https';
import { Graph } from './graph';
import { Client, Message } from "postmark";
import sharp from 'sharp';

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

import serviceAccount from '../kanvas-creds.json';

initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    storageBucket: 'kanvas-73a90.appspot.com'
});

const bucket = getStorage().bucket();

const NULL: string = "";

const graph = new Graph();

export class Controller {
    async generate(properties: string, fields: string, gameId: string, playerId: string, templateId: number): Promise<string> {
        try {
            const game = await this.getGame(gameId);
            if (game == null) {
                this.sendEmail(
                    "Kanvas: Critical Error",
                    `
                            <ul>
                                <li>Game Id: ${gameId}</li>
                                <li>Player Id: ${playerId}</li>
                                <li>Template Id: ${templateId}</li>
                                <li>Reason: Game was not found!.</li>
                            </ul>
                        `,
                    process.env.DEV_EMAIL,
                    process.env.POSTMARK_FROM
                );
                return NULL;
            };

            if (templateId >= game.templates.length) {
                this.sendEmail(
                    "Kanvas: Critical Error",
                    `
                            <ul>
                                <li>Game Id: ${gameId}</li>
                                <li>Player Id: ${playerId}</li>
                                <li>Template Id: ${templateId}</li>
                                <li>Reason: Invalid template id!.</li>
                            </ul>
                        `,
                    game.email,
                    process.env.POSTMARK_FROM
                );
                return NULL;
            }

            const { buffer, attributes } = await this.getImageNftUri(game, properties, fields, playerId, templateId);

            if (buffer == null) {
                this.sendEmail(
                    `${game.name} Failed to generate NFT URI`,
                    `
                        <ul>
                            <li>Game: ${game.name}</li>
                            <li>Player Id: ${playerId}</li>
                            <li>Reason: Failed to generate Nft Uri.</li>
                        </ul>
                    `,
                    game.email,
                    process.env.POSTMARK_FROM
                );
                return NULL;
            };

            const pngBuffer = await this.convertSvgToPng(buffer);
            if (pngBuffer == null) {
                this.sendEmail(
                    `${game.name} Failed to generate NFT URI`,
                    `
                        <ul>
                            <li>Game: ${game.name}</li>
                            <li>Player Id: ${playerId}</li>
                            <li>Reason: Failed to generate Nft Uri as PNG.</li>
                        </ul>
                    `,
                    game.email,
                    process.env.POSTMARK_FROM
                );
                return NULL;
            };

            const pngPath = `generated/${game.gameId}/${playerId}.png`;

            await bucket.file(pngPath).save(pngBuffer, {
                public: true
            });

            const downloadURL = await getDownloadURL(bucket.file(pngPath));

            this.sendEmail(
                `Kanvas: New NFT URI generated on ${game.name}`,
                `
                        <ul>
                            <li>Game: ${game.name}</li>
                            <li>Player Id: ${playerId}</li>
                            <img width="200px" src="${downloadURL}" />
                        </ul>
                    `,
                game.email,
                process.env.POSTMARK_FROM
            );

            const metdata: NFTMetadata = {
                name: game.name,
                description: game.description,
                external_url: game.website,
                image: downloadURL,
                attributes: attributes
            };

            const metadataPath = `metadatas/${game.gameId}/${playerId}.json`;

            await bucket.file(metadataPath).save(JSON.stringify(metdata), { public: true });


            return `https://firebasestorage.googleapis.com/v0/b/kanvas-73a90.appspot.com/o/metadatas%2F${gameId}%2F${playerId}.json?alt=media`;

        } catch (error) {
            console.error(error);
            return NULL;
        }
    }


    private async sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async getGame(gameId: string): Promise<Game | null> {
        try {
            const response = await graph.makeRequest(`
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
                    templates(orderDirection: asc, orderBy: blockTimestamp) {
                        templateUri
                    }
                }
            }
            `);

            return response.gameCreated as Game | null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    private async getImageNftUri(game: Game, data: string, data2: string, playerId: string, templateId: number): Promise<{ buffer: Buffer | null, attributes: Attribute[]; }> {
        const properties: string[] = this.parseProperties(data);
        const fields: string[] = this.parseFields(data2);

        const attributes: Attribute[] = [];

        try {
            if (fields.length !== properties.length) {
                this.sendEmail(
                    "Failed to generate NFT URI",
                    `
                        <ul>
                            <li>Game: ${game.name}</li>
                            <li>Player Id: ${playerId}</li>
                            <li>Reason: The length of your properties and fields are not equal.</li>
                        </ul>
                    `,
                    game.email,
                    process.env.POSTMARK_FROM
                );
                return { buffer: null, attributes: [] };
            }

            console.log('before readFile', 'svgBuffer');
            const svgBuffer: Buffer = await this.readFile(game.templates[templateId].templateUri);
            console.log('after readFile', 'svgBuffer');

            let svgContents: string = new TextDecoder('utf-8').decode(svgBuffer);

            for (let index = 0; index < fields.length; index++) {
                const field = fields[index];
                const replacement = properties[index];

                console.log(field, replacement);

                svgContents = svgContents.replace(field, replacement);

                attributes.push({
                    trait_type: this.transformString(fields[index]),
                    value: properties[index]
                });
            }

            const buffer: Buffer = Buffer.from(svgContents, 'utf-8');
            return { buffer, attributes };
        } catch (error) {
            console.error(error);
            return { buffer: null, attributes: [] };
        }
    }

    private transformString(inputString: string): string {
        // Remove leading and trailing dollar signs
        const cleanedString = inputString.replace(/^\$/, '').replace(/\$$/, '');

        // Capitalize the first letter and lowercase the rest
        return cleanedString.charAt(0).toUpperCase() + cleanedString.slice(1).toLowerCase();
    }

    private parseFields(fields: string): string[] {
        return fields.split(" ").filter(prop => prop.trim() !== '');
    }

    private parseProperties(fields: string): string[] {
        return fields.split(",").filter(prop => prop.trim() !== '');
    }

    private async readFile(uri: string): Promise<Buffer> {
        let chunks = Buffer.alloc(0);

        return new Promise((resolve, reject) => {
            https.get(uri, {
                rejectUnauthorized: false,
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
    }

    private async sendEmail(title: string, text: string, to: string, from: string) {
        try {
            const message: Message = {
                To: to,
                From: from,
                Subject: title,
                HtmlBody: text,
                TrackOpens: true,
                MessageStream: "broadcast"
            };

            const client = new Client(process.env.POSTMARK_TOKEN);
            await client.sendEmail(message);
        } catch (error) {
            console.error(error);
        }
    };

    // Function to convert SVG string to PNG buffer
    private async convertSvgToPng(buffer: Buffer): Promise<Buffer | null> {
        try {
            // Use sharp to convert SVG string to PNG buffer
            const pngBuffer = await sharp(buffer, { density: 300 })
                .png().toBuffer();

            return pngBuffer;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

}