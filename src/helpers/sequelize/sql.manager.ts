import { QueryTypes } from "sequelize";
import * as SqlConnection from "sequelize";

import { sequelize } from "./sequelize.config";

export class SqlManager {
  private _sequelize: SqlConnection.Sequelize;
  private params;

  constructor() {
    this._sequelize = sequelize.getSequelize();
  }

  public addInputParameter(parameterName: string, value: any): void {
    if (this.params == undefined) {
      this.params = {};
    }
    this.params[parameterName] = value;
  }

  public ExecuteQuery(qry: string): Promise<any> {
    return this._sequelize.query(qry, {
      type: QueryTypes.SELECT,
    });
  }

  public Get(qry: string, vals: any = null): Promise<any> {
    const parameter = this.params ? this.params : vals;
    return this._sequelize.query(
      {
        query: qry,
        values: parameter,
      },
      { type: QueryTypes.SELECT }
    );
  }

  public Insert(qry: string, vals: any = null): Promise<any> {
    const parameter = this.params ? this.params : vals;
    return this._sequelize.query(
      {
        query: qry,
        values: parameter,
      },
      { type: QueryTypes.INSERT }
    );
  }

  public Update(qry: string, vals: any = null): Promise<any> {
    const parameter = this.params ? this.params : vals;
    return this._sequelize.query(
      {
        query: qry,
        values: parameter,
      },
      { type: QueryTypes.UPDATE }
    );
  }

  public Delete(qry: string, vals: any = null): Promise<any> {
    const parameter = this.params ? this.params : vals;
    return this._sequelize.query(
      {
        query: qry,
        values: parameter,
      },
      { type: QueryTypes.DELETE }
    );
  }

  public Ping(): Promise<void> {
    return this._sequelize.authenticate();
  }
}
