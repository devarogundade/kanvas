import { Express, Response } from 'express';
import { Request, Router } from 'express';
import { Controller } from './controller';
import { OK } from './contants';

const controller = new Controller();
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

            return res.status(OK).send({ uri });
        });

        router.get('/', (_: Request, res: Response) => {
            return res.send('Kanvas Dynamic Nft Rendering Server. Visit https://kanvas-constellation.netlify.app to learn more about kanvas.');
        });

        app.use('/', router);
    }

}