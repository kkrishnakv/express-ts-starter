import { Router, Request, Response, NextFunction } from "express";

import { Api } from "../helpers";
import { AppRoute } from "../app-route";
import { SqlHelper } from "../helpers/sql/sql-helper";

export class CustomerController implements AppRoute {
  public route = "/customers";
  public router: Router = Router();
  constructor() {
    this.router.get("/", this.getCustomers);
    this.router.get("/:id", this.getCustomer);
    this.router.post("/", this.addCustomer);
    this.router.put("/:id", this.updateCustomer);
    this.router.delete("/:id", this.deleteCustomer);
  }

  public async getCustomers(
    request: Request,
    response: Response
  ): Promise<any> {
    const helper = new SqlHelper("select * from customer");
    const results = await helper.select();
    return Api.ok(request, response, results);
  }

  public async addCustomer(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const helper = new SqlHelper(
        "insert into customer(name,mobile) values (:name,:mobile) returning id"
      );
      helper.addParameter("name", request.body.name);
      helper.addParameter("mobile", request.body.mobile);
      const id = await helper.insert();
      Api.ok(request, response, id[0][0].id);
    } catch (exp) {
      next(exp);
    }
  }

  public async getCustomer(request: Request, response: Response): Promise<any> {
    const helper = new SqlHelper("select * from customer where id=:id");
    helper.addParameter("id", request.params.id);
    const result = await helper.select();
    return Api.ok(request, response, result[0]);
  }

  public async deleteCustomer(
    request: Request,
    response: Response
  ): Promise<any> {
    const helper = new SqlHelper("delete from customer where id=:id");
    helper.addParameter("id", request.params.id);
    await helper.delete();
    return Api.ok(request, response, "Deleted");
  }

  public async updateCustomer(
    request: Request,
    response: Response
  ): Promise<any> {
    const helper = new SqlHelper(
      "update customer set name=:name, mobile=:mobile where id=:id"
    );
    helper.addParameter("id", request.params.id);
    helper.addValues(request.body);
    await helper.update();
    Api.ok(request, response, "updated");
  }
}
