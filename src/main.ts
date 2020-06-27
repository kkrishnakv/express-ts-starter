import { ExpressApi } from "./express.api";
import { sequelize } from "./helpers/sequelize/sequelize.config";

const api = new ExpressApi();

api.run();
sequelize.setConnection();
const app = api.app;
export { app };
