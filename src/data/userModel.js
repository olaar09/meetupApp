const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
  constructor(tableName) {
    super(tableName);
    this.table = tableName;
  }
}

module.exports = UserModel;
