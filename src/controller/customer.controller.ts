import { Router, Request, Response, NextFunction } from "express";

import { Api } from "../helpers";
import { CustomerManager } from "../data-manager/customer.manager";
import { AppLogger } from "../helpers/app-logger";

export class CustomerController {
  public static route = "/customers";
  public router: Router = Router();
  constructor() {
    this.router.get("/", this.getCustomer);
    this.router.get("/:id", this.getCustomerById);
    this.router.post("/", this.addCustomer);
    this.router.put("/", this.updateCustomer);
    this.router.delete("/:id", this.deleteCustomer);
  }

  public getCustomer(
    request: Request,
    response: Response,
    next: NextFunction
  ): any {
    const manager = new CustomerManager();
    manager.getCustomers().then(
      (result) => {
        AppLogger.info(typeof this, "test");
        return Api.ok(request, response, result);
      },
      (error) => {
        next(error);
      }
    );
  }

  public getCustomerById(
    request: Request,
    response: Response,
    next: NextFunction
  ): any {
    const manager = new CustomerManager();
    const id = Number.parseInt(request.params.id, 0);
    manager.getCustomer(id).then(
      (result) => {
        return Api.ok(request, response, result[0]);
      },
      (error) => {
        next(error);
      }
    );
  }

  public addCustomer(
    request: Request,
    response: Response,
    next: NextFunction
  ): any {
    const manager = new CustomerManager();
    manager.addCustomer(request.body).then(
      (result) => {
        return Api.ok(request, response, result[1]);
      },
      (error) => {
        next(error);
      }
    );
  }

  public updateCustomer(
    request: Request,
    response: Response,
    next: NextFunction
  ): any {
    const manager = new CustomerManager();
    manager.updateCustomer(request.body).then(
      (result) => {
        return Api.ok(request, response, result[1]);
      },
      (error) => {
        next(error);
      }
    );
  }

  public deleteCustomer(
    request: Request,
    response: Response,
    next: NextFunction
  ): any {
    const manager = new CustomerManager();
    const id = Number.parseInt(request.params.id, 0);
    manager.deleteCustomer(id).then(
      () => {
        return Api.ok(request, response, "Ok");
      },
      (error) => {
        next(error);
      }
    );
  }
}
