
const assert = require('assert');

const getModule = require('../src/modules');
const client = require('../src/data/connectToDb');


const questionModule = getModule('questions');
const questionData = {
  meetup: 6,
  title: 'How are you?',
  body: 'cool quest',
  votes: 0,
  createdBy: 4,
};

after(() => {
  client.end();
});

describe('Create a question [POST /questions :param questionData<Object> ]', () => {
  it('it should not throw an exception  while creating a new question', async () => {
    await assert.doesNotReject(() => questionModule.createQuestion(questionData));
  });
});

describe('get a question [GET /questions :param id<int> ]', () => {
  // add question
  let questionAdded = {};
  before(() => new Promise(async (resolve, reject) => {
    try {
      [questionAdded] = await questionModule.createQuestion(questionData);      
      resolve(questionAdded[0]);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  }));

  it('it should not reject when getting question with correct id', async () => {
    await assert.doesNotReject(() => questionModule.getQuestion(questionAdded.id));
  });
});


describe('votes a question [PATCH /questions/votes :param questionId<Integer>,]', async () => {
  let questionDataBefore = {};
  before(() => new Promise(async (resolve) => {
    [questionDataBefore] = await questionModule.createQuestion(questionData);
    resolve(questionDataBefore);
  }));


  it('it should not reject    while upvoting a question', async () => {
    await assert.doesNotReject(() => questionModule.voteQuestion(questionDataBefore.id));
  });

  it('it should not throw an exception  while down voting a question', async () => {
    await assert.doesNotReject(async () => questionModule.voteQuestion(
      questionDataBefore.id,
      true,
    ));
  });
});
