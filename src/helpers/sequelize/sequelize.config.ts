import { Sequelize } from "sequelize";

import { AppSetting, IConfig } from "../../config";

export class SequelizeConfig {
  private sequelize: Sequelize;
  public setConnection(): void {
    const config: IConfig = AppSetting.getConfig();
    const databaseInfo = config.dbConnections.default;
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
