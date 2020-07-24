import { ExpressApi } from "./express.api";

const api = new ExpressApi();

api.run();

const app = api.app;
export { app };
