import { Environment, IConfig } from '.';
import { ConfigManager } from './config.manager';
import { cloneDeep } from 'lodash';

export class AppSetting {

    public static Env = Environment.Dev;

    public static getConfig(): IConfig {
        let configManager = new ConfigManager();
        return cloneDeep(configManager.Config);
    }
}
