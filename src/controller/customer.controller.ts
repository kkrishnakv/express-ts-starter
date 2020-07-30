import { Router, Request, Response, NextFunction } from "express";

import { Api } from "../helpers";
import { AppRoute } from "../app-route";

export class CustomerController implements AppRoute {
  public route = "/customers";
  public router: Router = Router();
  constructor() {
    this.router.get("/", this.getCustomer);
  }

  public getCustomer(
    request: Request,
    response: Response,
    next: NextFunction
  ): any {
    return Api.ok(request, response, "Customer");
  }

}
