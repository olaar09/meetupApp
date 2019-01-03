const express = require('express');
const Validator = require('validatorjs');
const HttpStatus = require('http-status-codes');

const getModule = require('../../modules');
const responseHelper = require('../../helpers/responseHelper');


const router = express.Router();
const userModule = getModule('users');


const loginDataValidateRules = {
  password: 'required',
  email: 'required|email',
};

const createUserDataValidateRules = {
  password: 'required',
  email: 'required|email',
  firstname: 'required',
  lastname: 'required',
  othername: 'required',
  phoneNumber: 'numeric|required',
  username: 'required',
  isAdmin: 'integer',
  // registered: 'requ'
};


/* POST: login user. */
router.post('/login', async (req, res) => {
  const validation = new Validator(req.body, loginDataValidateRules);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const user = await userModule.loginUser(req.body);
    return responseHelper.endResponse(res, HttpStatus.OK, user);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.UNAUTHORIZED);
  }
});


/* POST: create a new users. */
router.post('/', async (req, res) => {
  const validation = new Validator(req.body, createUserDataValidateRules);
  if (validation.fails()) {
    return responseHelper.endResponse(res, HttpStatus.UNPROCESSABLE_ENTITY, validation.errors);
  }
  try {
    const user = await userModule.createUser(req.body);
    return responseHelper.endResponse(res, HttpStatus.OK, user);
  } catch (error) {
    return responseHelper.endResponse(res, HttpStatus.INTERNAL_SERVER_ERROR, error.getMessage());
  }
});


module.exports = router;
