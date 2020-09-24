import { Router } from "express";
import { CustomerController } from "./controller/customer.controller";
import { AppRoute } from "./app-route";
export class AppRouting {
  constructor(private route: Router) {
    this.route = route;
    this.configure();
  }
  public configure() {
    // Add the routing classes.
    this.addRoute(new CustomerController());
  }

  private addRoute(appRoute: AppRoute) {
    this.route.use(appRoute.route, appRoute.router);
  }
}
