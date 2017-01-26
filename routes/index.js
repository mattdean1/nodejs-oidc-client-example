var express = require('express');
var router = express.Router();


//Middleware that checks if a user is logged in
function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
    return res.redirect('/openid?redirect=' + req.originalUrl);
}

//Uncomment the following line to require authentication on every page
//router.use(checkAuthentication());

//Home page does not require authentication
router.get('/', function(req, res, next) {
  res.render('index');
});

//Private page requires authentication and displays the users OpenId profile information
router.get('/private',
  ensureAuthenticated(),
  function(req, res, next){
    res.render('private', {user: req.user});
  }
);

//Logs the user out and redirects to the home page
router.get('/logout', function(req, res){
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

//Use this when you need to authenticate - you can pass a url to redirect to after authentication as the '?redirect=' param
router.get('/openid', function(req, res, next){
  if (req.query.redirect) {
    req.session.authRedirect = req.query.redirect;
  }
  passport.authenticate('openidconnect')(req, res, next);
});

//Callback url given to pingfederate team - this will redirect to the url saved by /openid if one exists
router.get('/openid/callback',
  passport.authenticate('openidconnect', { failureRedirect: '/login' }),
  function(req, res) {
    var redirect = req.session.authRedirect;
    if (redirect) {
      delete req.session.authRedirect;
    }
    //redirect to the specified url if it exists, or root otherwise
    res.redirect(303, redirect || '/');
  });

module.exports = router;
