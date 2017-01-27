var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);

//setup mongo connection values
var user = process.env.MONGODB_USER;
var password = process.env.MONGODB_PASSWORD;
var host = process.env.MONGODB_SERVICE_HOST;
var port = process.env.MONGODB_SERVICE_PORT;
var database = process.env.MONGODB_DATABASE;
var connectionstring = user + ":" + password + "@" + host + ":" + port + "/" + database;

var mongoStore = new MongoDBStore(
  {
      uri: 'mongodb://' + connectionstring,
      collection: 'sessions'
  }
);
// Catch errors
mongoStore.on('error', function(error) {
  console.log('Mongo Error: ' + error);
});


var sessionOptions = {
  saveUninitialized: false, // saved new sessions
  resave: false, // do not automatically write to the session store
  store: mongoStore,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    maxAge: 1800000,
  },
};

module.exports = session(sessionOptions);
