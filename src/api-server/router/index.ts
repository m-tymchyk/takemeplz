import express from 'express';

export default function buildRouter(): express.Router {
    const router = express.Router();

    router.get('/', (req: express.Request, response: express.Response) => {
        response.send({
            path: req.path,
        });
    });

    return router;
}
