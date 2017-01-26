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


module.exports = passport;
