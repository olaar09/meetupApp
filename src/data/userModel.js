const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
  constructor() {
    const tableName = 'appuser';
    super(tableName);
  }
}

module.exports = UserModel;
