import { Router } from "express";
import { CustomerController } from "./controller/customer.controller";
import { AppRoute } from "./app-route";
export class AppRouting {
    private route: Router;
    public configure(route: Router) {
        this.route = route;
        // Add the routing classes.
        this.addRoute(new CustomerController());
    }

    private addRoute(appRoute: AppRoute) {
        this.route.use(appRoute.route, appRoute.router);

    }

}