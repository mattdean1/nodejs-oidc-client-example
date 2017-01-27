var express = require('express');
var router = express.Router();

//Middleware that checks if a user is logged in
var ensureAuthenticated = function(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
    return res.redirect('/openid?redirect=' + req.originalUrl);
};


//Uncomment the following line to require authentication on every page
//router.use(ensureAuthenticated);


//Home page does not require authentication
router.get('/', function(req, res, next) {
  res.render('index');
});

//Private page requires authentication and displays the users OpenId profile information
router.get('/private',
  ensureAuthenticated,
  function(req, res, next){
    res.render('private', {user: req.user});
  }
);



module.exports = router;
