import { Router, Request, Response, NextFunction } from 'express';
import { Api } from '../helpers';

export class CustomerController {
    public static route = '/customer';
    public router: Router = Router();
    constructor() {
        this.router.get('/', this.getCustomer);
        this.router.get('/:id', this.getCustomerById);
    }
    public getCustomer(request: Request, response: Response, next: NextFunction) {
        return Api.ok(request, response, 'Customer info');
    }

    public getCustomerById(request: Request, response: Response, next: NextFunction) {
        return Api.ok(request, response, request.params['id']);

    }
}



