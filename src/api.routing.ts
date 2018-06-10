import * as express from 'express';
import { CustomerController } from './controller/customer.controller';
import { Api } from './helpers';
export class ApiRouting {

    public static ConfigureRouters(app: express.Router) {
        app.use(CustomerController.route, new CustomerController().router);
    }
}
