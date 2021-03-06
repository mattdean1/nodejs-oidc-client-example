var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var MongoClient = require('mongodb').MongoClient;

var sessionStore;

//setup session options
var sessionOptions = {
  saveUninitialized: true, // saved new sessions
  resave: false, // do not automatically write to the session store
  store: sessionStore,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    maxAge: 1800000,
  },
};

//setup mongo connection values
var user = process.env.MONGODB_USER;
var password = process.env.MONGODB_PASSWORD;
var host = process.env.MONGODB_SERVICE_HOST;
var port = process.env.MONGODB_SERVICE_PORT;
var database = process.env.MONGODB_DATABASE;

//if we have all the required information, set up a connection to the database
if(user && password && host && port && database){
  var connectionstring = user + ":" + password + "@" + host + ":" + port + "/" + database;

  MongoClient.connect("mongodb://"+connectionstring, function(err, db) {
      if(err){
        console.log("Can't connect to mongoDB using the provided host information and credentials, falling back to use MemoryStore for session storage");
      }
      else {
        sessionStore = new MongoDBStore(
          {
              uri: 'mongodb://' + connectionstring,
              collection: 'sessions'
          },
          function(e){
            //catch error
          }
        );
      }
  });
}


module.exports = session(sessionOptions);
