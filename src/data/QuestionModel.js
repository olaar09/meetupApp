const BaseModel = require('./BaseModel');
const { executeQuery } = require('../helpers/dbhelper');


class QuestionModel extends BaseModel {
  constructor(tableName) {
    super(tableName);
    this.table = 'question';
  }

  voteQuestion(questionId, isUpvote = true) {
    const query = {
      text: `UPDATE ${this.table} SET votes = ${isUpvote ? ' votes + 1' : ' votes - 1'}  WHERE id = '${questionId}' RETURNING *`,
    };

    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = await executeQuery(query);
        return resolve(queryResult.rows[0]);
      } catch (error) {
        return reject(error);
      }
    });
  }
}

module.exports = QuestionModel;
