import { SqlManager } from '../helpers/sequelize/sql.manager';
import { ICustomer } from '../entities/ICustomer';
export class CustomerManager {
    private db: SqlManager;
    constructor() {
        this.db = new SqlManager();
    }
    public addCustomer(customer: ICustomer) {
        let query = "INSERT INTO customers (name,address) VALUES(:Name,:Address)";
        return this.db.Insert(query, customer);
    }

    public updateCustomer(customer: ICustomer) {
        let query = "UPDATE customers SET name=:Name, address=:Address WHERE Id=:Id";
        return this.db.Update(query, customer);
    }

    public deleteCustomer(id) {
        let query = "DELETE FROM customers WHERE Id=:id";
        this.db.addInputParameter("id", id);
        return this.db.Delete(query);
    }

    public getCustomers() {
        let query = "SELECT Id,Name,Address FROM customers";
        return this.db.Get(query, null);
    }

    public getCustomer(id) {
        let query = "SELECT Id,Name,Address FROM customers WHERE Id=:id";
        this.db.addInputParameter("id", id);
        return this.db.Get(query);
    }
}
