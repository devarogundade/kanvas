import { Express, Response } from 'express';
import { Request, Router } from 'express';
import { Controller } from './controller';
import { OK } from './contants';

const controller = new Controller();

export class Route {

    constructor(app: Express, router: Router) {
        router.get('/generate', async (req: Request, res: Response) => {
            const { properties, fields, gameId, playerId } = req.query;
            const uri = await controller.generate(
                properties as string,
                fields as string,
                gameId as string,
                playerId as string
            );

            return res.status(OK).send({ uri });
        });

        app.use('/', router);
    }

}