
// const BaseErrClass = require('../helpers/BaseErrorClass');
// const ErrorStrings = require('../helpers/repsonseStringHelper');

const CommentModel = require('../data/commentModel');


class Comment {
  constructor() {
    this.commentModel = new CommentModel();
  }

  addCommentToQuestion(commentData) {
    return new Promise(async (resolve, reject) => {
      try {
        const newComment = await this.commentModel.push({
          columnNames: ['question', 'createdBy', 'comment'],
          columnValues: [
            commentData.question,
            commentData.createdBy,
            commentData.comment,
          ],
        });
        resolve(newComment);
      } catch (error) {
        reject(error);
      }
    });
  }
}
// new QuestionNotFoundError(ErrorStrings.questionNotFound)
module.exports = Comment;
