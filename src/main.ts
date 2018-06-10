
import { ExpressApi } from './express.api';
import { AppSetting } from './config/AppSetting';

let api = new ExpressApi();

api.run();
console.log(`listening on ${AppSetting.Port}`);
let app = api.app;
export { app };
