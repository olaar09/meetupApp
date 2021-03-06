
const BaseErrClass = require('../helpers/BaseErrorClass');
const ErrorStrings = require('../helpers/repsonseStringHelper');

const QuestionModel = require('../data/QuestionModel');
const CommentModel = require('../data/commentModel');

class QuestionNotFoundError extends BaseErrClass {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, QuestionNotFoundError);
  }
}


class Questions {
  constructor() {
    this.questionModel = new QuestionModel();
    this.commentModel = new CommentModel();
    this.questionNotFoundError = QuestionNotFoundError;
  }

  getQuestions() {
    return new Promise(async (resolve, reject) => {
      try {
        const question = await this.questionModel.filter();
        if (question) {
          return resolve(question);
        }
        return reject(new QuestionNotFoundError(ErrorStrings.questionNotFound));
      } catch (error) {
        return reject(error);
      }
    });
  }

  getQuestion(questionId) {
    return new Promise(async (resolve, reject) => {
      try {
        const question = await this.questionModel.find([`id = ${questionId}`]);
        if (question) {
          return resolve(question);
        }
        return reject(new QuestionNotFoundError(ErrorStrings.questionNotFound));
      } catch (error) {
        return reject(error);
      }
    });
  }

  createQuestion(questionData) {
    return new Promise(async (resolve, reject) => {
      questionData.votes = 0;
      try {
        const newQuestion = await this.questionModel.push({
          columnNames: ['meetup', 'createdBy', 'title', 'body', 'votes'],
          columnValues: [
            questionData.meetup,
            questionData.createdBy,
            questionData.title,
            questionData.body,
            questionData.votes,
          ],
        });
        return resolve(newQuestion);
      } catch (error) {
        return reject(error);
      }
    });
  }

  addCommentToQuestion(commentData) {
    return new Promise(async (resolve, reject) => {
      try {
        const question = await this.getQuestion(commentData.question);
        commentData.question = question.id;
        const newComment = await this.commentModel.push(commentData);
        resolve(newComment);
      } catch (error) {
        reject(error);
      }
    });
  }


  voteQuestion(questionId, isUpvote = true) {
    return new Promise(async (resolve, reject) => {
      try {
        const question = await this.questionModel.voteQuestion(questionId, isUpvote);
        return resolve(question);
      } catch (error) {
        return reject(error);
      }
    });
  }
}
// new QuestionNotFoundError(ErrorStrings.questionNotFound)
module.exports = Questions;
