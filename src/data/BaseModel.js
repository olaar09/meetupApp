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
    return new Promise(async (resolve, reject) => {
      try {
        const results = await this.filter(conditions);
        resolve(results[0]);
      } catch (error) {
        reject(error);
      }
    });
  }

  async filter(conditions = []) {
    return new Promise(async (resolve, reject) => {
      const query = {
        text: `SELECT * from ${this.table} ${conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''}`,
      };
      try {
        const queryResult = await executeQuery(query);
        return resolve(queryResult.rows);
      } catch (error) {
        return reject(error);
      }
    });
  }

  push(data) {
    return new Promise(async (resolve, reject) => {
      const paramValues = data.columnNames.map((x, index) => `$${index + 1}`);
      const query = {
        text: `INSERT INTO ${this.table}(${data.columnNames.join()}) VALUES(${paramValues.join()}) RETURNING *`,
        values: data.columnValues,
      };

      try {
        const queryResult = await executeQuery(query);
        resolve(queryResult.rows);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = BaseModel;
