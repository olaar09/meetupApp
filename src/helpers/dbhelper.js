const client = require('../data/connectToDb');

const BaseErrClass = require('../helpers/BaseErrorClass');

class DBQueryError extends BaseErrClass {
  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, DBQueryError);
  }
}


const executeQuery = sqlToExecute => new Promise((resolve, reject) => {
  client.query(sqlToExecute)
    .then(res => resolve(res))
    .catch(e => reject(new DBQueryError(e.stack)));
});

module.exports = {
  executeQuery,
};
