import { Worker } from "worker_threads";

export class Controller {
    async generate(properties: string, fields: string, gameId: string, playerId: string, templateId: number): Promise<string> {
        new Worker(
            __dirname + "/worker.js",
            {
                workerData: { properties, fields, gameId, playerId, templateId }
            }
        );

        return `https://firebasestorage.googleapis.com/v0/b/kanvas-73a90.appspot.com/o/metadatas%2F${gameId}%2F${playerId}.json?alt=media`;
    }
}