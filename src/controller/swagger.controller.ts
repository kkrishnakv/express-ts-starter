import { Router, Request, Response, NextFunction, Express } from 'express';
import { AppSetting } from './../config';
const swaggerUi = require('swagger-ui-express');
const customer = require('../swagger-docs/customer.swagger.json');

export class SwaggerController {
    public static route = '/swagger';
    public router: Router = Router();
    private showExplorer = false;

    constructor(app: Express) {
        app.use('/swagger/customer', swaggerUi.serve, swaggerUi.setup(customer, this.showExplorer));
    }
}
