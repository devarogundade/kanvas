import https from 'https';
import { Graph } from './graph';
import { Client, Message } from "postmark";

import { initializeApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getStorage, getDownloadURL } from 'firebase-admin/storage';

import serviceAccount from '../kanvas-creds.json';

initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    storageBucket: 'kanvas-73a90.appspot.com'
});

const bucket = getStorage().bucket();

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
                return "";
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
                return "";
            }

            const buffer: Buffer | null = await this.getImageNftUri(game, properties, fields, playerId, templateId);
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
                return "";
            };

            const path = `generated/${game.gameId}/${playerId}.svg`;

            await bucket.file(path).save(buffer, {
                public: true
            });

            const downloadURL = await getDownloadURL(bucket.file(path));

            this.sendEmail(
                `Kanvas: New NFT URI generated on ${game.name}`,
                `
                        <ul>
                            <li>Game: ${game.name}</li>
                            <li>Player Id: ${playerId}</li>
                            <img src="${downloadURL}" />
                        </ul>
                    `,
                game.email,
                process.env.POSTMARK_FROM
            );

            const Metadata = {
                name: game.name,
                description: game.description,
                external_url: game.website,
                image: downloadURL
            };

            const metadataPath = `nfts/${game.gameId}/${playerId}.json`;

            await bucket.file(metadataPath).save(JSON.stringify(Metadata), { public: true });

            return await getDownloadURL(bucket.file(metadataPath));
        } catch (error) {
            console.error(error);
            return "";
        }
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

    private async getImageNftUri(game: Game, data: string, data2: string, playerId: string, templateId: number): Promise<Buffer | null> {
        const properties: string[] = this.parseProperties(data);
        const fields: string[] = this.parseFields(data2);

        if (properties.length != fields.length) {
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
            return null;
        }

        try {
            const buffer: Buffer = await this.readFile(game.templates[templateId].templateUri);
            const svgContents: string = new TextDecoder('utf-8').decode(buffer);

            let svgString: string = "";

            for (let index = 0; index < properties.length; index++) {
                console.log(`replacing ${fields[index]} with ${properties[index]}`);
                svgString = svgContents.replace(fields[index], properties[index]);
            }

            return Buffer.from(svgString, 'utf-8');
        } catch (error) {
            console.error(error);
            return null;
        }
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

}