
const client = require('./connectToDb');

const queries = [
  // 'DROP TABLE IF EXISTS appuser;',
  'CREATE  TABLE IF NOT EXISTS  appuser(id SERIAL PRIMARY KEY, firstname VARCHAR(40) not null, lastname VARCHAR(40) not null, othername VARCHAR(40) not null, email VARCHAR(40) not null, phoneNumber VARCHAR(40) not null, username VARCHAR(40) not null, isAdmin BOOLEAN not null, registered timestamp default(now() at time zone \'utc\'))',
  // 'DROP TABLE IF EXISTS meetup;',
  'CREATE  TABLE  IF NOT EXISTS meetup(id SERIAL PRIMARY KEY, createdOn timestamp default(now() at time zone \'utc\'), location VARCHAR(40) not null, images  TEXT [], happeningOn date not null, tags  VARCHAR(200) not null)',
  // 'DROP TABLE IF EXISTS question;',
  'CREATE TABLE  IF NOT EXISTS question(id SERIAL PRIMARY KEY, createdOn timestamp default(now() at time zone \'utc\'), createBy integer not null, meetup integer not null, title VARCHAR(40) not null, body VARCHAR(500) not null, votes integer not null)',
  // 'DROP TABLE IF EXISTS rsvp;',
  'create type rsvp_responses as enum(\'yes\', \'no\')',
  // 'DROP TABLE IF EXISTS rsvp;',
  'CREATE TABLE  IF NOT EXISTS rsvp(id SERIAL PRIMARY KEY, meetup integer not null, appuser integer not null, response rsvp_responses not null)',
];


(() => {
  queries.forEach((queryToExecute) => {
    client.query(queryToExecute)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  });
})();
