
const assert = require('assert');

const getModule = require('../src/modules');

const meetupModule = getModule('meetups');

const client = require('../src/data/connectToDb');

const meetupData = {
  location: 'Lekki, Banana island ',
  images: ['img1.jpg', 'img2.jpg'],
  topic: 'Mocha test one',
  happeningOn: new Date(),
  tags: ['#cool', '#makenigeriagreatagain'],
  // appuser: 1,
};


const rsvpData = {
  user: 1,
  response: 'yes',
};


after(() => {
  client.end();
});


describe('get all meetups [GET /meetups ]', () => {
  it('it should return an array of meetups', async () => {
    const meetups = await meetupModule.getMeetups();
    assert(meetups instanceof Array);
  });
});


describe('get a meetup [GET /meetups :param id<int> ]', () => {
  // add meetup
  let meetupAdded = {};
  before(() => new Promise(async (resolve) => {
    meetupAdded = await meetupModule.createMeetup(meetupData);
    resolve(meetupAdded);
  }));

  it('it should not reject a meetup object', async () => {
    await assert.doesNotReject(() => meetupModule.getMeetup(meetupAdded.id));
  });
});


describe('create a meetup [POST /meetups :param meetupData<Object> ]', () => {
  it('it should not throw an exception  while creating a new meetup', async () => {
    await assert.doesNotReject(() => meetupModule.createMeetup(meetupData));
  });
});

describe('POST: RSVP a meetup [POST /meetups/<id>/rsvps :param rsvpData<Object> ]', () => {
  // add meetup
  let meetupAdded = {};
  before(() => new Promise(async (resolve, reject) => {
    try {
      meetupAdded = await meetupModule.createMeetup(meetupData);      
      resolve(meetupAdded);
    } catch (error) {
      reject(error);
    }
  }));

  it('it should not reject when adding rsvp', async () => {
    rsvpData.meetup = meetupAdded.id;
    await assert.doesNotReject(async () => meetupModule.meetupRSVP(rsvpData));
  });

  it('it should not rsvp more than once', async () => {
    await assert.rejects(async () => meetupModule.meetupRSVP(rsvpData));
  });
});
