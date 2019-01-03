const BaseModel = require('./BaseModel');

class MeetupModel extends BaseModel {
  constructor(tableName) {
    super(tableName);
    this.table = tableName;
  }
}

module.exports = MeetupModel;
