const pg = require('pg');

const connectionString = 'postgres://nmbbfpol:k45DhN2YdxAbyp2I53AYqpubwa-e1xVG@manny.db.elephantsql.com:5432/nmbbfpol';

const client = new pg.Client(connectionString);
client.connect();


module.exports = client;
