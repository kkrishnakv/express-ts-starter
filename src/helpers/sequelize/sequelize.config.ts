import { AppSetting, IConfig } from "../../config";
import { Sequelize } from "sequelize";
export class SequelizeConfig {
  private sequelize: Sequelize;
  public setConnection() {
    const config: IConfig = AppSetting.getConfig();
    const dbInfo = config.dbConnections["default"];
    let options = dbInfo.options;
    options["logging"] = console.log;
    this.sequelize = new Sequelize(
      dbInfo.database,
      dbInfo.user,
      dbInfo.password,
      options
    );
  }

  public getSequelize() {
    return this.sequelize;
  }
}

export const sequelize = new SequelizeConfig();
