
const assert = require('assert');

const getModule = require('../src/modules');

const userModule = getModule('users');

const userMockData = {
  password: '111111',
  email: 'saboki11@gmail.com',
  firstname: 'Yusuf',
  lastname: 'Agboola',
  othername: 'Oladipupo',
  username: 'olaar09',
  phoneNumber: '08184424512',
  isAdmin: false,
};

describe('Authenticate a user with a token', () => {
  const userWrongToken = 'o45y78werufiodjlkcxwerfre';
  let userData = {};

  describe('Authenticate userr with right token', () => {
    beforeEach(() => new Promise(async (resolve, rejects) => {
      try {
        userData = await userModule.createUser(userMockData);
        resolve(userData);
      } catch (error) {
        rejects(error);
      }
    }));

    it('it should not reject user with correct token', async () => {    
      await assert.doesNotReject(() => userModule.authUser(userData.userJwt));
    });
  });

  it('It should reject  auth a user with wrong token', async () => {
    await assert.rejects(() => userModule.authUser(userWrongToken));
  });
});

describe('create a new user [POST /users :param userData<Object> ]', () => {
  it('it should not reject  while creating a new user', async () => {
    await assert.doesNotReject(async () => userModule.createUser(userMockData));
  });

  it('It should return an object after creating a user', () => {
    assert.equal(userModule.createUser(userMockData) instanceof Object, true);
  });
});


describe('get a user [GET /users :param userId<Integer> ]', () => {
  const invalidUserId = 5000;

  describe('', () => {
    let user = {};

    beforeEach(() => new Promise(async (resolve, rejects) => {
      try {
        user = await userModule.createUser(userMockData);
        resolve(user);
      } catch (error) {
        rejects(error);
      }
    }));

    it('it should not throw an exception  while getting a user', async () => {
      const { userData } = user;
      await assert.doesNotReject(() => userModule.getUser(userData.id));
    });
  });


  it('It should reject  for invalid userId', async () => {
    await assert.rejects(() => userModule.getUser(invalidUserId));
  });
});
