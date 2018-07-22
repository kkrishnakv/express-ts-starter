import { Router, Request, Response, NextFunction, Express } from 'express';
import { AppSetting } from './../config';
const swaggerUi = require('swagger-ui-express');
import * as customer from '../swagger-docs/customer.swagger.json';

export class SwaggerController {

    public static configure(app: Express) {
        app.use('/swagger/customer', swaggerUi.serve, swaggerUi.setup(customer));
    }
}
