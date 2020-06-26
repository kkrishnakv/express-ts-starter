import { SqlManager } from "../helpers/sequelize/sql.manager";
import { ICustomer } from "../entities/ICustomer";

export class CustomerManager {
  private db: SqlManager;
  constructor() {
    this.db = new SqlManager();
  }

  public addCustomer(customer: ICustomer) {
    const query = "INSERT INTO customers (name,address) VALUES(:Name,:Address)";
    return this.db.Insert(query, customer);
  }

  public updateCustomer(customer: ICustomer) {
    const query =
      "UPDATE customers SET name=:Name, address=:Address WHERE Id=:Id";
    return this.db.Update(query, customer);
  }

  public deleteCustomer(id) {
    const query = "DELETE FROM customers WHERE Id=:id";
    this.db.addInputParameter("id", id);
    return this.db.Delete(query);
  }

  public getCustomers() {
    const query = "SELECT Id,Name,Address FROM customers";
    return this.db.Get(query, null);
  }

  public getCustomer(id) {
    const query = "SELECT Id,Name,Address FROM customers WHERE Id=:id";
    this.db.addInputParameter("id", id);
    return this.db.Get(query);
  }
}
