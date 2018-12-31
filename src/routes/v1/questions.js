const express = require('express');
const HttpStatus = require('http-status-codes');
const Validator = require('validatorjs');

const getModule = require('../../modules');
const responseHelper = require('../../helpers/responseHelper');

const questionsModule = getModule('questions');
const router = express.Router();

const createQuestionDataValidateRules = {
  createdOn: 'required',
  createdBy: 'integer|required',
  meetup: 'integer|required',
  title: 'required',
  body: 'required',
  votes: 'integer',
  // id,
};

const upvoteDownVoteValidations = {
  questionId: 'required',
};


/* GET : get all questions. */
router.get('/', async (req, res) => {
  try {
    const questions = await questionsModule.getQuestions();
    return responseHelper.endResponse(res, HttpStatus.OK, questions);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.METHOD_FAILURE);
  }
});

/* POST: create a  question. */
router.post('/', async (req, res) => {
  const validation = new Validator(req.body, createQuestionDataValidateRules);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const question = await questionsModule.createMeetup(req.body);
    return responseHelper.endResponse(res, HttpStatus.OK, question);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.METHOD_FAILURE);
  }
});

/* PATCH: upvote a  question. */
router.patch('/:questionId/upvote', async (req, res) => {
  const validation = new Validator(req.params, upvoteDownVoteValidations);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const question = await questionsModule.voteQuestion(req.params.questionId);
    return responseHelper.endResponse(res, HttpStatus.OK, question);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.METHOD_FAILURE);
  }
});

/* PATCH: downvote a  question. */
router.patch('/:questionId/downvote', async (req, res) => {
  const validation = new Validator(req.params, upvoteDownVoteValidations);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const question = await questionsModule.voteQuestion(req.params.questionId, false);
    return responseHelper.endResponse(res, HttpStatus.OK, question);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.METHOD_FAILURE);
  }
});


module.exports = router;
