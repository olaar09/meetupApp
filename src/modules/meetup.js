
const BaseErrClass = require('../helpers/BaseErrorClass');
const ErrorStrings = require('../helpers/repsonseStringHelper');
const MeetupModel = require('../data/MeetupModel');
const RSVPModel = require('../data/rsvpModel');

const radix = 10;

class MeetupNotFoundError extends BaseErrClass {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, MeetupNotFoundError);
  }
}

class RSVPError extends BaseErrClass {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, RSVPError);
  }
}

class Meetup {
  constructor() {
    this.meetupModel = new MeetupModel();
    this.rsvpModel = new RSVPModel();
    this.MeetupNotFoundError = MeetupNotFoundError;
    this.RSVPError = RSVPError;
  }

  getMeetups() {
    return new Promise(async (resolve, reject) => {
      try {
        const meetup = await this.meetupModel.filter();
        if (meetup) {
          return resolve(meetup);
        }
        return reject(new MeetupNotFoundError(ErrorStrings.meetupNotFound));
      } catch (error) {
        return reject(new Error('internal server error'));
      }
    });
  }

  getUpcomingMeetups(userId) {
    return new Promise(async (resolve, reject) => {
      try {
        const upcomingMeetups = await this.meetupModel.getUpcomingMeetups(userId);
        return resolve(upcomingMeetups);
      } catch (error) {
        return reject(error);
      }
    });
  }

  getMeetup(meetupId) {
    return new Promise(async (resolve, reject) => {
      try {
        const meetup = await this.meetupModel.find([`id = '${parseInt(meetupId, 10)}'`]);
        if (meetup) {
          return resolve(meetup);
        }
        return reject(new MeetupNotFoundError(ErrorStrings.meetupNotFound));
      } catch (error) {
        return reject(new Error('internal server error'));
      }
    });
  }

  createMeetup(meetupData) {
    return new Promise(async (resolve, reject) => {
      try {
        const newMeetup = await this.meetupModel.push({
          columnNames: ['location', 'images', 'topic', 'happeningOn', 'tags'],
          columnValues: [
            meetupData.location,
            [...meetupData.images],
            meetupData.topic,
            meetupData.happeningOn,
            [...meetupData.tags],
          ],
        });
        return resolve(newMeetup[0]);
      } catch (error) {
        return reject(error);
      }
    });
  }

  getMeetupRSVP(user, meetup) {
    return new Promise(async (resolve, reject) => {
      try {
        const rsvp = await this.rsvpModel.find([`appuser = ${user}`, `meetup = ${meetup}`]);
        if (rsvp) {
          return resolve(rsvp);
        }
        return reject(new RSVPError(ErrorStrings.RSVPNotfound));
      } catch (error) {
        return reject(error);
      }
    });
  }

  async hasRSVPed(user, meetup) {
    return new Promise(async (resolve, reject) => {
      try {
        const hasRSVP = await this.getMeetupRSVP(user, meetup);
        return resolve(!!hasRSVP);
      } catch (error) {
        if (error instanceof RSVPError) {
          return resolve(false);
        }
        return reject(error);
      }
    });
  }

  meetupRSVP(rsvpData) {
    return new Promise(async (resolve, reject) => {
      const meetup = await this.getMeetup(parseInt(rsvpData.meetup, radix));
      if (meetup) {
        try {
          const hasRsvped = await this.hasRSVPed(rsvpData.user, rsvpData.meetup);
          if (hasRsvped) {
            return reject(new RSVPError(ErrorStrings.AlreadyRsvped));
          }
          const newRsvp = await this.rsvpModel.push({
            columnNames: ['meetup', 'appuser', 'response'],
            columnValues: [
              rsvpData.meetup,
              rsvpData.user,
              rsvpData.response,
            ],
          });
          return resolve(newRsvp);
        } catch (error) {
          return reject(error);
        }
      }
      return reject(new MeetupNotFoundError(ErrorStrings.meetupNotFound));
    });
  }
}

module.exports = Meetup;
