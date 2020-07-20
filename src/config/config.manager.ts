import { AppLogger } from "../helpers";

import { IConfig } from "./i-config";
import { AppSetting } from "./app.setting";

import { Environment } from ".";

import nconf = require("nconf");

export class ConfigManager {
  public Config: IConfig;
  constructor() {
    let filename;

    switch (AppSetting.Env) {
      case Environment.Development:
      case Environment.Local:
        filename = "config.dev.json";
        break;
      case Environment.Production:
        filename = "config.prod.json";
        break;
      default:
        AppLogger.error("config", "Unable to read the config file");
        process.exit();
        break;
    }
    nconf.use("memory");
    if (!nconf.get("Config")) {
      this.getFile(filename);
    }
    this.Config = nconf.get("Config");
    if (!this.Config) {
      AppLogger.error("config", "Unable to read the config file");

      process.exit(1);
    }
  }

  public getFile(filename: string): void {
    nconf.file("Config", {
      file: filename,
      dir: "./config/",
      search: true,
    });
    if (!nconf.get("Config")) {
      nconf.file("Config", {
        file: `config/${filename}`,
        dir: __dirname,
        search: true,
      });
    }
  }

  public reset(): void {
    nconf.reset();
    nconf.clear();
  }
}
