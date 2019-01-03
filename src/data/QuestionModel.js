const BaseModel = require('./BaseModel');


class QuestionModel extends BaseModel {
  constructor(tableName) {
    super(tableName);
    this.table = tableName;
  }
}

module.exports = QuestionModel;
