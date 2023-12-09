import { Express, Response } from 'express';
import { Request, Router } from 'express';
import { Controller } from './controller';
import { OK } from './contants';
import { RockPaperScissorsController } from './rockpaperscissors';

const controller = new Controller();
const rpsController = new RockPaperScissorsController();

export class Route {
    constructor(app: Express, router: Router) {
        router.get('/generate/:properties/:fields/:gameId/:playerId/:templateId', async (req: Request, res: Response) => {
            const { properties, fields, gameId, playerId, templateId } = req.params;

            const uri = await controller.generate(
                properties as string,
                fields as string,
                gameId as string,
                playerId as string,
                Number(templateId)
            );

            console.log('RESPONSE ' + uri);

            return res.status(OK).send({ uri });
        });

        router.get('/rockpaperscissors/upgrade/:chainId/:playerId', async (req: Request, res: Response) => {
            const { chainId, playerId } = req.params;

            const txId = await rpsController.upgradePlayer(
                Number(chainId) as 43113 | 80001,
                playerId
            );

            return res.status(OK).send({ txId });
        });

        router.get('/rockpaperscissors/downgrade/:chainId/:playerId', async (req: Request, res: Response) => {
            const { chainId, playerId } = req.params;

            const txId = await rpsController.downgradePlayer(
                Number(chainId) as 43113 | 80001,
                playerId
            );

            return res.status(OK).send({ txId });
        });

        router.get('/', (_: Request, res: Response) => {
            return res.send('Kanvas Dynamic Nft Rendering Server. Visit https://kanvas-constellation.netlify.app to learn more about kanvas.');
        });

        app.use('/', router);
    }
}