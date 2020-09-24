import { Router } from "express";

export interface AppRoute {
  route: string;
  router: Router;
}
