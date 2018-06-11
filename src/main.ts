
import { ExpressApi } from './express.api';
import { AppSetting } from './config';

let api = new ExpressApi();

api.run();
console.log(`listening on ${AppSetting.getConfig().port}`);
let app = api.app;
export { app };
