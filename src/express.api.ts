import { Router, Request, Response, NextFunction } from 'express';
import { json, urlencoded } from 'body-parser';

import * as http from 'http';
import * as compression from 'compression';
import * as express from 'express';

import { Logger } from './helpers/logger';
import { ApiRouting } from './api.routing';
import { Api } from './helpers/api';
import { AppSetting } from './config/AppSetting';

export class ExpressApi {
    public app: express.Express;
    private router: express.Router;


    constructor() {
        this.app = express();
        this.router = express.Router();
        this.configure();
    }

    private configure() {
        this.configureMiddleware();
        this.configureBaseRoute();
        this.configureRoutes();
        this.errorHandler();
    }

    private configureMiddleware() {
        this.app.use(json({ limit: '50mb' }));
        this.app.use(compression());
        this.app.use(urlencoded({ limit: '50mb', extended: true }));
        Logger.configureLogger(this.app);
    }

    private configureBaseRoute() {
        this.app.use(function (req, res, next) {
            if (req.url === '/') {
                return res.json({
                    name: '1.0.0',
                    version: 'api',
                });
            } else {
                next();
            }
        });
        this.app.use('/', this.router);
    }

    private configureRoutes() {
        this.app.use(function (req: Request, res: Response, next: NextFunction) {
            for (let key in req.query) {
                if (key) {
                    req.query[key.toLowerCase()] = req.query[key];
                }
            }
            next();
        });

        ApiRouting.ConfigureRouters(this.app);
    }

    private errorHandler() {
        this.app.use(function (err, req, res, next) {
            if (req.body) {
                Logger.error(req.body);
            }
            Logger.error(err);
            Api.serverError(req, res, err);
        });

        // catch 404 and forward to error handler
        this.app.use(function (req, res, next) {
            Api.notFound(req, res);
        });
    }


    public run() {

        let server = http.createServer(this.app);
        server.listen(AppSetting.Port);
        server.on('error', this.onError);
    }

    private onError(error) {
        let port = AppSetting.Port;
        if (error.syscall !== 'listen') {
            throw error;
        }

        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}
