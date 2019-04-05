import express from 'express';
import passport from 'passport';
import session from 'express-session';
import { Strategy as LocalStrategy } from 'passport-local';

const user = {
    username: 'test-user',
    password: 'my-password',
    id: 1,
};

function findUser(username: string, callback: any) {
    if (username === user.username) {
        return callback(null, user);
    }

    return callback(null);
}

function authenticationMiddleware() {
    return (req: express.Request, res: express.Response, next: any) => {
        if (req.isAuthenticated()) {
            return next();
        }

        res.status(401).send('Need auth');
    };
}

export default function initPassport(expressApp: express.Application) {
    const strategy = new LocalStrategy(function (username: string, password: string, done: any) {
            findUser(username, function (err: Error, user: any) {
                if (err) {
                    return done(err);
                }

                if (!user) {
                    return done(null, false);
                }

                if (password !== user.password) {
                    return done(null, false);
                }

                return done(null, user);
            });
        },
    );

    (passport as any).authenticationMiddleware = authenticationMiddleware;
    passport.use(strategy);

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    expressApp.use(
        session({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true,
            cookie: {
                secure: true,
            },
        }),
    );

    expressApp.use(passport.initialize());
    expressApp.use(passport.session());
}
