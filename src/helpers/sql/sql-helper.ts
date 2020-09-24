import { QueryTypes } from "sequelize";
import * as SqlConnection from "sequelize";
import { sequelize } from "./sequelize.config";

export class SqlHelper {
  private _sequelize: SqlConnection.Sequelize;
  private params = {};

  constructor(private query: string) {
    this._sequelize = sequelize.getSequelize();
  }

  public addParameter(parameterName: string, value: any): void {
    this.params[parameterName] = value;
  }

  public addValues(values: any) {
    this.params = { ...this.params, ...values };
  }

  public async execute(): Promise<any> {
    return this._sequelize.query(this.query, {
      replacements: this.params,
      type: QueryTypes.RAW,
    });
  }

  public async select(): Promise<any> {
    return this._sequelize.query(this.query, {
      replacements: this.params,
      type: QueryTypes.SELECT,
    });
  }

  public async insert(): Promise<any> {
    return this._sequelize.query(this.query, {
      replacements: this.params,
      type: QueryTypes.INSERT,
    });
  }

  public async update(): Promise<any> {
    return this._sequelize.query(this.query, {
      replacements: this.params,
      type: QueryTypes.UPDATE,
    });
  }

  public async delete(): Promise<any> {
    return this._sequelize.query(this.query, {
      replacements: this.params,
      type: QueryTypes.DELETE,
    });
  }

  public async authenticate(): Promise<void> {
    return this._sequelize.authenticate();
  }
}
