const BaseModel = require('./BaseModel');

class MeetupModel extends BaseModel {
  constructor(tableName) {
    super(tableName);
    this.table = 'meetup';
  }
}

module.exports = MeetupModel;
