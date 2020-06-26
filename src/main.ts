import { ExpressApi } from "./express.api";
import { AppSetting } from "./config";
import { sequelize } from "./helpers/sequelize/sequelize.config";

const api = new ExpressApi();

api.run();
console.log(`listening on ${AppSetting.getConfig().port}`);
sequelize.setConnection();
const app = api.app;
export { app };
