const { executeQuery } = require('../helpers/dbhelper');

class BaseModel {
  constructor(tableName) {
    this.table = tableName;
  }

  async update(data) {
    const paramValues = data.columnNames.map((x, index) => `$${index + 1}`);
    const query = {
      text: `UPDATE  ${this.table} SET (${data.columnNames.join()}) VALUES(${paramValues.join()})`,
      values: data.columnValues,
    };

    try {
      const queryResult = await executeQuery(query);
      return queryResult.rows;
    } catch (error) {
      return error;
    }
  }

  find(conditions = []) {
    const results = this.filter(conditions);
    return results[0];
  }

  async filter(conditions = []) {
    const query = {
      text: `SELECT * from ${this.table} WHERE ${conditions.join(' AND ')}`,
    };
    try {
      const queryResult = await executeQuery(query);
      return queryResult.rows;
    } catch (error) {
      return error;
    }
  }

  async push(data) {
    const paramValues = data.columnNames.map((x, index) => `$${index + 1}`);
    const query = {
      text: `INSERT INTO ${this.table}(${data.columnNames.join()}) VALUES(${paramValues.join()})`,
      values: data.columnValues,
    };

    try {
      const queryResult = await executeQuery(query);
      return queryResult.rows;
    } catch (error) {
      return error;
    }
  }
}

module.exports = BaseModel;
