import { AppSetting, IConfig } from '../../config';
import * as SqlConnection from 'sequelize';
import { ConfigManager } from '../../config/config.manager';
export class SequelizeConfig {
    private sequelize: SqlConnection.Sequelize;
    public setConnection() {
        const config: IConfig = AppSetting.getConfig();
        const dbInfo = config.DBConnections['default'];
        let options = dbInfo.options;
        options['logging'] = console.log;
        this.sequelize = new SqlConnection(dbInfo.database, dbInfo.user, dbInfo.password, options);
    }

    public getSequelize() {
        return this.sequelize;
    }
}

export const sequelize = new SequelizeConfig();
