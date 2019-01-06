
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
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userModel.find([`id = '${parseInt(userId, 10)}'`]);
        if (user) {
          return resolve(User.returnUserData(user));
        }
        return reject(new this.NotFoundErr('user not found'));
      } catch (error) {
        return reject(new Error('internal server error'));
      }
    });
  }


  authUser(token) {
    return new Promise(async (resolve, reject) => {
      jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
          return reject(new this.AuthFailedErr('token is invalid'));
        }
        try {
          const user = await this.userModel.find([`id = '${decoded.id}'`]);
          if (user) {
            return resolve(User.returnUserData(user));
          }
          return reject(new this.NotFoundErr('user not found'));
        } catch (error) {
          return reject(new Error('errror getting user'));
        }
      });
    });
  }

  loginUser(userData) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await this.userModel.find([`email = '${userData.email}'`]);
        if (user) {
          const passwordIsValidbcrypt = bcrypt.compareSync(userData.password, user.password);
          if (!passwordIsValidbcrypt) {
            return reject(new this.AuthFailedErr('password incorrect'));
          }
          const userJwt = User.getSignJWT(user.id);
          return resolve({ userJwt, userData: User.returnUserData(user) });
        }
        return reject(new this.AuthFailedErr('user not found'));
      } catch (error) {
        return reject(new Error('errror getting user'));
      }
    });
  }

  deleteUser(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await this.userModel.remove([`id = '${parseInt(userId, 10)}'`]);
        if (response > 0) {
          return resolve(response);
        }
        return reject(new this.NotFoundErr('user not found'));
      } catch (error) {
        return reject(new Error('internal server error'));
      }
    });
  }

  createUser(userData, isAdmin = true) {
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
        const userJwt = User.getSignJWT(newUser[0].id);
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
