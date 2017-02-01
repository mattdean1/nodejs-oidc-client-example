var express = require('express');
var router = express.Router();

//Middleware that checks if a user is logged in

//as default, authentication middleware does nothing
var ensureAuthenticated = function(req, res, next){
  return next();
};

//If authentication is required, we check requests are authorised before proceeding
if(process.env.AUTHENTICATION_IS_REQUIRED){
  ensureAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
      return next();
    }
      //If the user is not already authorised, redirect them to authentication
      return res.redirect('/openid?redirect=' + req.originalUrl);
  };
}



/*
 * Uncomment the following line if you require authentication on every page
 * Using this means you do not have to repeat 'ensureAuthenticated' in every route
 * If you require authentication on some pages but not others, use the pattern shown in the routes below.
*/
//router.use(ensureAuthenticated);



//Home page does not require authentication
router.get('/', function(req, res, next) {
  res.render('index');
});

//Private page requires authentication and displays the users OpenId profile information
router.get('/private',
  //using the authentication middleware to secure the page
  ensureAuthenticated,
  function(req, res, next){
    res.render('private', {user: req.user});
  }
);



module.exports = router;
