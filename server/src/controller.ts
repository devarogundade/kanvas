import Web3 from 'web3';
import { Graph } from './graph';
import { Client, Message } from "postmark";
import { create } from 'ipfs-http-client';

const graph = new Graph();

export class Controller {
    async generate(properties: string, fields: string, gameId: string, playerId: string): Promise<string> {
        try {
            const game = await this.getGame(gameId);
            if (game == null) return "";

            const Json = {
                name: "Some Nft",
                description: "About Some Nft",
                images: this.getImageNftUri(game, properties, fields, playerId)
            };

            const auth = 'Basic ' + Buffer.from(
                process.env.INFURA_PROJECT_ID + ':' + process.env.INFURA_PROJECT_SECRET
            ).toString('base64');

            /* Create an instance of the client */
            const client = create({
                host: 'ipfs.infura.io',
                port: 5001,
                protocol: 'https',
                headers: {
                    authorization: auth,
                }
            });

            const result = await client.add(JSON.stringify(Json));

            return result.path;
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
                    avatar
                    plan
                    creator
                    email
                    templates
                }
            }
            `);
            return response.gameCreated as Game | null;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    private getImageNftUri(game: Game, data: string, data2: string, playerId: string): string {
        const web3 = new Web3();

        const properties: any = web3.eth.abi.decodeParameters(['string[]'], data);
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

        fields.forEach(field => {
            svg = game.templates[0].replace(field, '');
        });

        return this.toBase64(svg);
    }

    private parseFields(fields: string): string[] {
        return fields.split(" ");
    }

    private toBase64(svg: string): string {
        return Buffer.from(svg).toString('base64');
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