import { Express } from "express";

import * as customer from "../swagger-docs/customer.swagger.json";

import swaggerUi = require("swagger-ui-express");

export class SwaggerController {
  public static configure(app: Express) {
    app.use("/swagger/customer", swaggerUi.serve, swaggerUi.setup(customer));
  }
}
