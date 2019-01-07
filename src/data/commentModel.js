const BaseModel = require('./BaseModel');


class CommentModel extends BaseModel {
  constructor(tableName) {
    super(tableName);
    this.table = 'comment';
  }
}

module.exports = CommentModel;
