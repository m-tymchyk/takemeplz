import express from 'express';
import passport from 'passport';

export default function buildRouter(): express.Router {
    const router = express.Router();

    router.get('/', (req: express.Request, response: express.Response) => {
        response.send({
            path: req.path,
        });
    });


    router.get('/auth/me',
        (passport as any).authenticationMiddleware(),
        (req: express.Request, response: express.Response) => {
            response.send({
                user: req.user,
            });
        },
    );


    router.post('/auth/login',
        (request: express.Request, response: express.Response, next: any) => {
            passport.authenticate('local', { session: true, authInfo: true }, (err?: Error, user?: any, info?: any) => {
                console.log({ info, user });

                if (err) {
                    return next(err);
                }

                if (!user) {
                    return response.status(400).send(info);
                }

                request.logIn(user, (err: Error) => {
                    if (err) {
                        return next(err);
                    }

                    return response.send({
                        user: user,
                    });
                });
            })(request, response, next);
        },
    );

    return router;
}
