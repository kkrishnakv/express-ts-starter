import { Logger } from "../../helpers/logger";
import { sequelize, SequelizeConfig } from "./sequelize.config";
import { QueryTypes } from "sequelize";
import * as SqlConnection from "sequelize";

export class SqlManager {
  private _sequelize: SqlConnection.Sequelize;
  private params;

  constructor() {
    this._sequelize = sequelize.getSequelize();
  }

  public addInputParameter(paramName: string, value: any) {
    if (this.params == null) {
      this.params = {};
    }
    this.params[paramName] = value;
  }

  public ExecuteQuery(qry: string) {
    return this._sequelize.query(qry, {
      type: QueryTypes.SELECT
    });
  }

  public Get(qry: string, vals: any = null) {
    let param = this.params ? this.params : vals;
    return this._sequelize.query(
      {
        query: qry,
        values: param
      },
      { type: QueryTypes.SELECT }
    );
  }

  public Insert(qry: string, vals: any = null) {
    let param = this.params ? this.params : vals;
    return this._sequelize.query(
      {
        query: qry,
        values: param
      },
      { type: QueryTypes.INSERT }
    );
  }

  public Update(qry: string, vals: any = null) {
    let param = this.params ? this.params : vals;
    return this._sequelize.query(
      {
        query: qry,
        values: param
      },
      { type: QueryTypes.UPDATE }
    );
  }

  public Delete(qry: string, vals: any = null) {
    let param = this.params ? this.params : vals;
    return this._sequelize.query(
      {
        query: qry,
        values: param
      },
      { type: QueryTypes.DELETE }
    );
  }

  public Ping() {
    return this._sequelize.authenticate();
  }
}
