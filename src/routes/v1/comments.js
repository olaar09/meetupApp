const express = require('express');
const HttpStatus = require('http-status-codes');
const Validator = require('validatorjs');

const getModule = require('../../modules');
const responseHelper = require('../../helpers/responseHelper');

const commentModule = getModule('comments');
const questionModule = getModule('questions');

const router = express.Router();


const createCommentValidateRules = {
  comment: 'required',
  question: 'required|integer',
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
    const questionExists = await questionModule.getQuestion(req.body.question);

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
    if (error instanceof questionModule.questionNotFoundError) {
      return responseHelper.endResponse(res, HttpStatus.NOT_FOUND, error.getMessage());
    }

    return responseHelper.endResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
