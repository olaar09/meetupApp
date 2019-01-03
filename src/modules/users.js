
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const BaseErrClass = require('../helpers/BaseErrorClass');
const UserModel = require('../data/userModel');

// const errCodes = require('../helpers/appErrorCodeHelper');
// const errStrings = require('../helpers/repsonseStringHelper');

const CRYPTO_SALT = 8;

// TODO move to .env;
const JWT_SECRET = 'myquestionier-dummyapp';

class UserAuthFailedError extends BaseErrClass {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, UserAuthFailedError);
  }
}


class UserNotFoundError extends Error {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, UserNotFoundError);
  }
}


class User {
  constructor() {
    this.userModel = new UserModel();
    this.AuthFailedErr = UserAuthFailedError;
    this.NotFoundErr = UserNotFoundError;
  }

  getUser(userId) {
    return new Promise((resolve, reject) => {
      const user = this.userModel.find(x => x.id === parseInt(userId, 10));
      if (user) {
        return resolve(User.returnUserData(user));
      }
      return reject(new this.NotFoundErr('user not found'));
    });
  }


  authUser(token) {
    return new Promise((resolve, reject) => {
      const user = this.userModel.find(x => x.jwtToken === token);
      if (user) {
        return resolve(User.returnUserData(user));
      }
      return reject(new this.AuthFailedErr('token is invalid'));
    });
  }

  loginUser(userData) {
    return new Promise((resolve, reject) => {
      const user = this.userModel.find(x => x.email === userData.email);
      if (user) {
        const passwordIsValidbcrypt = bcrypt.compareSync(userData.password, user.password);
        if (!passwordIsValidbcrypt) {
          return reject(new this.AuthFailedErr('password incorrect'));
        }
        const userJwt = User.getSignJWT(user.id);
        return resolve({ userJwt, userData: User.returnUserData(user) });
      }
      return reject(new this.AuthFailedErr('user not found'));
    });
  }

  createUser(userData, isAdmin = false) {
    return new Promise(async (resolve, reject) => {
      userData.password = bcrypt.hashSync(userData.password, CRYPTO_SALT);
      userData.isAdmin = isAdmin;
      try {
        const newUser = await this.userModel.push({
          columnNames: ['firstname', 'lastname', 'othername', 'phoneNumber', 'email', 'username', 'isAdmin', 'password'],
          columnValues: [
            userData.firstname,
            userData.lastname,
            userData.othername,
            userData.phoneNumber,
            userData.email,
            userData.username,
            userData.isAdmin,
            userData.password,
          ],
        });
        const userJwt = User.getSignJWT(newUser.id);
        return resolve({ userJwt, userData: User.returnUserData(newUser[0]) });
      } catch (error) {
        return reject(error);
      }
    });
  }

  static returnUserData(userData) {
    const getUserData = {};
    Object.assign(getUserData, userData);

    // do stuff with userData
    delete getUserData.password;
    return getUserData;
  }

  static getSignJWT(userId) {
    return jwt.sign({ id: userId }, JWT_SECRET, {
      // expires in 365 days
      expiresIn: '365d',
    });
  }
}

module.exports = User;
