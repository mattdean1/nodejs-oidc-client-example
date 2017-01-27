var passport = require('passport');
var OpenIdConnectStrategy = require('passport-openidconnect').Strategy;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete OIDC profile is
//   serialized and deserialized.
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

/**
 * OpenId connect Strategy
 * @type {OpenIdConnectStrategy}
 */
var openIdConnectStrategy = new OpenIdConnectStrategy({
        clientID: process.env.OIDC_CLIENT_ID,
        clientSecret: process.env.OIDC_CLIENT_SECRET,
        callbackURL: process.env.OIDC_CALLBACK_URL,
        authorizationURL: process.env.OIDC_AUTHORIZE_URL,
        tokenURL: process.env.OIDC_TOKEN_URL,
        userInfoURL: process.env.OIDC_USER_INFO_URL,
        scope: 'auth_web openid profile email'
    },
    function(token, tokenSecret, profile, cb) {
        // Passing profile info to callback
        return cb(null, profile);
    }
);

passport.use(openIdConnectStrategy);


module.exports = function(app){

  app.use(passport.initialize());
  app.use(passport.session());

  //Logs the user out and redirects to the home page
  app.get('/logout', function(req, res){
    req.logout();
    req.session.destroy(function() {
      res.redirect('/');
    });
  });

  //Used to authenticate the user - you can pass a url to redirect to after authentication as the '?redirect=' param
  app.get('/openid', function(req, res, next){
    if (req.query.redirect) {
      req.session.authRedirect = req.query.redirect;
    }
    passport.authenticate('openidconnect')(req, res, next);
  });

  //Callback url given to pingfederate team - this will redirect to the url saved by /openid if one exists
  app.get('/openid/callback',
    passport.authenticate('openidconnect', { failureRedirect: '/' }),
    function(req, res) {
      var redirect = req.session.authRedirect;
      if (redirect) {
        delete req.session.authRedirect;
      }
      //redirect to the specified url if it exists, or root otherwise
      res.redirect(303, redirect || '/');
  });

};
