
const BaseErrClass = require('../helpers/BaseErrorClass');

class QuestionNotFoundError extends BaseErrClass {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, QuestionNotFoundError);
  }
}


class Questions {
  constructor() {
    this.questionModel = [];
  }

  getQuestions() {
    return new Promise(resolve => resolve(this.questionModel));
  }

  getQuestion(questionId) {
    return new Promise((resolve, reject) => {
      const question = this.questionModel.find(x => x.id === parseInt(questionId, 10));
      if (question) {
        return resolve(question);
      }
      return reject(new QuestionNotFoundError());
    });
  }

  createQuestion(questionData) {
    return new Promise((resolve) => {
      questionData.id = this.questionModel.length;
      this.questionModel.push(questionData);
      return resolve(questionData);
    });
  }


  voteQuestion(questionId, isUpvote = true) {
    return new Promise((resolve, reject) => {
      const question = this.questionModel.find(x => x.id === parseInt(questionId, 10));
      if (question) {
        const currentVote = question.votes;
        question.votes = (isUpvote) ? (currentVote + 1) : (currentVote - 1);
        return resolve(question);
      }
      return reject(new QuestionNotFoundError());
    });
  }
}

module.exports = Questions;
