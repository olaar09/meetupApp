const express = require('express');
const HttpStatus = require('http-status-codes');
const Validator = require('validatorjs');

const getModule = require('../../modules');
const responseHelper = require('../../helpers/responseHelper');

const commentModule = getModule('comments');

const router = express.Router();


const createCommentValidateRules = {
  meetup: 'integer|required',
  title: 'required',
  body: 'required',
  votes: 'integer',
};

/* POST: comment on a question. */
router.post('/', async (req, res) => {
  const validation = new Validator(req.body, createCommentValidateRules);
  if (validation.fails()) {
    return responseHelper.endResponse(
      res,
      HttpStatus.UNPROCESSABLE_ENTITY,
      validation.errors,
    );
  }
  try {
    const questionExists = await this.getQuestion(req.body.question);

    if (!questionExists) {
      return responseHelper.endResponse(
        res,
        HttpStatus.NOT_FOUND,
        'question not found',
      );
    }
    const createdBy = req.getUserId();
    const commentData = { ...req.body, createdBy };
    const newComment = await commentModule.addCommentToQuestion(commentData);
    return responseHelper.endResponse(res, HttpStatus.OK, newComment);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
