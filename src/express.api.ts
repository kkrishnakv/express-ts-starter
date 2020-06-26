import { Request, Response, NextFunction } from "express";
import { json, urlencoded } from "body-parser";
import * as compression from "compression";
import * as express from "express";
import * as http from "http";

import { Logger } from "./helpers/logger";
import { ApiRouting } from "./api.routing";
import { Api } from "./helpers/api";
import { IConfig, AppSetting } from "./config";
import { SwaggerController } from "./controller/swagger.controller";
import { AuthenticationModule } from "./helpers/authentication.module";

export class ExpressApi {
  public app: express.Express;
  private router: express.Router;
  private config: IConfig;

  constructor() {
    this.app = express();
    this.router = express.Router();
    this.config = AppSetting.getConfig();
    this.configure();
  }

  private configure() {
    this.configureMiddleware();
    this.configureBaseRoute();
    this.configureRoutes();
    this.errorHandler();
  }

  private configureMiddleware() {
    this.app.use(json({ limit: "50mb" }));
    this.app.use(compression());
    this.app.use(urlencoded({ limit: "50mb", extended: true }));
    AuthenticationModule.authenticate(this.app);
    Logger.configureLogger();
  }

  private configureBaseRoute() {
    this.app.use((request, res, next) => {
      const config = AppSetting.getConfig();
      if (request.url === "/") {
        return res.json(config.appConfig);
      } else {
        next();
      }
    });
    this.app.use("/", this.router);
  }

  private configureRoutes() {
    this.app.use((request: Request, res: Response, next: NextFunction) => {
      for (const key in request.query) {
        if (key) {
          request.query[key.toLowerCase()] = request.query[key];
        }
      }
      next();
    });

    ApiRouting.ConfigureRouters(this.app);
    SwaggerController.configure(this.app);
  }

  private errorHandler() {
    this.app.use((error, request: Request, res) => {
      if (request.body) {
        Logger.error(request.body);
      }
      Logger.error(error);
      Api.serverError(request, res, error);
    });

    // catch 404 and forward to error handler
    this.app.use((request, res) => {
      Api.notFound(request, res);
    });
  }

  public run() {
    const server = http.createServer(this.app);
    server.listen(this.config.port);
    server.on("error", this.onError);
  }

  private onError(error) {
    const port = this.config.port;
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(`${bind} requires elevated privileges`);
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(`${bind} is already in use`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}
