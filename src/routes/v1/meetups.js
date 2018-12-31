const express = require('express');
const HttpStatus = require('http-status-codes');
const Validator = require('validatorjs');

const getModule = require('../../modules');
const responseHelper = require('../../helpers/responseHelper');

const meetupModule = getModule('meetups');
const router = express.Router();

const createMeetupDataValidateRules = {
  location: 'required',
  images: 'array',
  topic: 'required',
  happeningOn: 'required',
  tags: 'required',
  // createdOn.
  // id,
};

const rsvpMeetupValidateRules = {
  meetup: 'required|integer',
  user: 'required|integer',
  response: 'required',
  // createdOn.
  // id,
};

/* GET: get all meetups  */
router.get('/', async (req, res) => {
  try {
    const meetups = await meetupModule.getMeetups();
    return responseHelper.endResponse(res, HttpStatus.OK, meetups);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.METHOD_FAILURE);
  }
});

/* GET: get a specific meetup  */
router.get('/:id', async (req, res) => {
  try {
    const meetup = await meetupModule.getMeetup(req.params.id);
    return responseHelper.endResponse(res, HttpStatus.OK, meetup);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.NOT_FOUND);
  }
});

/* POST: create a  meetup. */
router.post('/', async (req, res) => {
  const validation = new Validator(req.body, createMeetupDataValidateRules);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const user = await meetupModule.createMeetup(req.body);
    return responseHelper.endResponse(res, HttpStatus.OK, user);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.METHOD_FAILURE);
  }
});

/* PATCH: RSVP  a  meetup. */
router.patch('/:meetupid/rsvp', async (req, res) => {
  const validation = new Validator(req.params, rsvpMeetupValidateRules);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const meetup = await meetupModule.meetupRSVP(req.params.meetupId, false);
    return responseHelper.endResponse(res, HttpStatus.OK, meetup);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.METHOD_FAILURE);
  }
});

module.exports = router;
