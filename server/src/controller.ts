import { Graph } from './graph';
import { Client, Message } from "postmark";
// import { create as UploadUri } from 'ipfs-http-client';
import https from 'https';

const graph = new Graph();
export class Controller {
    async generate(properties: string, fields: string, gameId: string, playerId: string, templateId: number): Promise<string> {
        try {
            console.log('PARAMS', properties, fields, gameId, playerId, templateId);

            const game = await this.getGame(gameId);
            console.log('GAME', game);

            if (game == null) return "";

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
                    templates {
                        templateUri
                    }
                }
            }
            `);

            console.log(response);

            return response.gameCreated as Game | null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    private async getImageNftUri(game: Game, data: string, data2: string, playerId: string, templateId: number): Promise<string> {
        const properties: string[] = this.parseProperties(data);
        console.log('PROPERTIES: ' + properties);

        const fields: string[] = this.parseFields(data2);
        console.log('FIELDS: ' + properties);

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
            return "";
        }

        let svg: string = "";

        const svgContents: string = await this.readFile(game.templates[templateId].templateUri);

        fields.forEach(field => {
            svg = svgContents.replace(field, '');
        });

        return this.toBase64(svg);
    }

    private parseFields(fields: string): string[] {
        return fields.split(" ");
    }

    private parseProperties(fields: string): string[] {
        return fields.split(",");
    }

    private toBase64(svg: string): string {
        return Buffer.from(svg).toString('base64');
    }

    private async readFile(uri: string): Promise<string> {
        let result: string = "";

        return new Promise((resolve, reject) => {
            https.get(uri, {
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
    }

    private async sendEmail(title: string, text: string, to: string, from: string) {
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
    };

}