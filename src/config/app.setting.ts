import { cloneDeep } from "lodash";

import { ConfigManager } from "./config.manager";

import { Environment, IConfig } from ".";

export class AppSetting {
  public static Env = Environment.Development;

  public static getConfig(): IConfig {
    const configManager = new ConfigManager();
    return cloneDeep(configManager.Config);
  }
}
