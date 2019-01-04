const BaseModel = require('./BaseModel');
const { executeQuery } = require('../helpers/dbhelper');

class RSVPModel extends BaseModel {
  constructor(tableName) {
    super(tableName);
    this.table = 'rsvp';
  }

  getRSVPedMeetups(userId) {
    const query = {
      text: `SELECT * FROM ${this.table} INNER JOIN meetup ON meetup.id = rsvp.meetup WHERE appuser = '${userId}' AND response = 'yes' `,
    };

    return new Promise(async (resolve, reject) => {
      try {
        const queryResult = await executeQuery(query);
        return resolve(queryResult.rows);
      } catch (error) {
        return reject(error);
      }
    });
  }
}

module.exports = RSVPModel;
