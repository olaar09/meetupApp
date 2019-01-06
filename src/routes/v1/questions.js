const express = require('express');
const HttpStatus = require('http-status-codes');
const Validator = require('validatorjs');

const getModule = require('../../modules');
const responseHelper = require('../../helpers/responseHelper');

const questionsModule = getModule('questions');
const meetupsModule = getModule('meetups');

const router = express.Router();

const createQuestionDataValidateRules = {
  meetup: 'integer|required',
  title: 'required',
  body: 'required',
  votes: 'integer',
  // createdOn: 'required',
  // id,
};

const upvoteDownVoteValidations = {
  questionId: 'required|integer',
};


/* GET : get all questions. */
router.get('/', async (req, res) => {
  try {
    const questions = await questionsModule.getQuestions();
    return responseHelper.endResponse(res, HttpStatus.OK, questions);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

/* POST: create a  question. */
router.post('/', async (req, res) => {
  const validation = new Validator(req.body, createQuestionDataValidateRules);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const meetupExists = await meetupsModule.getMeetup(req.body.meetup);
    if (!meetupExists) {
      return responseHelper.endResponse(res, HttpStatus.NOT_FOUND, 'meetup not found');
    }
    const createdBy = req.getUserId();
    const questionData = { ...req.body, createdBy };
    const question = await questionsModule.createQuestion(questionData);
    return responseHelper.endResponse(res, HttpStatus.OK, question);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
  }
});


/* PATCH: upvote a  question. */
router.patch('/:questionId(\\d+)/upvote', async (req, res) => {
  const validation = new Validator(req.params, upvoteDownVoteValidations);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const question = await questionsModule.voteQuestion(req.params.questionId);
    return responseHelper.endResponse(res, HttpStatus.OK, question);
  } catch (error) {
    if (error instanceof questionsModule.questionNotFoundError) {
      return responseHelper.endResponse(res, HttpStatus.NOT_FOUND, 'question not found');
    }
    return responseHelper.endResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
  }
});

/* PATCH: downvote a  question. */
router.patch('/:questionId(\\d+)/downvote', async (req, res) => {
  const validation = new Validator(req.params, upvoteDownVoteValidations);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const question = await questionsModule.voteQuestion(req.params.questionId, false);
    return responseHelper.endResponse(res, HttpStatus.OK, question);
  } catch (error) {
    if (error instanceof questionsModule.questionNotFoundError) {
      return responseHelper.endResponse(res, HttpStatus.NOT_FOUND, 'question not found');
    }
    return responseHelper.endResponse(res, HttpStatus.INTERNAL_SERVER_ERROR);
  }
});


module.exports = router;
