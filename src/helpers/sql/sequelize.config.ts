import { Sequelize } from "sequelize";

import { ConfigManager, Config } from "../../config";

export class SequelizeConfig {
  private sequelize: Sequelize;
  public setConnection(): void {
    const config: Config = new ConfigManager().config;
    const databaseInfo = config.databases.default;
    const options = databaseInfo.options;
    options.logging = console.log;
    this.sequelize = new Sequelize(
      databaseInfo.database,
      databaseInfo.user,
      databaseInfo.password,
      options
    );
  }

  public getSequelize(): Sequelize {
    return this.sequelize;
  }
}

export const sequelize = new SequelizeConfig();
