var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http  = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var session = require('express-session');
var errorhandler = require('errorhandler');
var methodOverride = require('method-override');
var router = express.Router()
var low = require('lowdb');
var storage = require('lowdb/file-async');
var db = low('db.json', {storage});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//passport local Strategy
passport.use(new LocalStrategy({
  usernameField: 'email', passwordField: 'password'
},
  function(email, password, done){
    // console.log(email, password, db('users').chain().filter({isActive: true}).find({email: email, password: password}).value());
    var user = db('users').chain().filter({isActive: true}).find({email: email, password: password}).value()
    if(user != undefined)
      return done(null, user);

    return done(null, false, {message: 'incorrect username/password'});
  }
));

//serialize and deserialize passport user session
passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});

//middleware auth routing
var auth = function(req, res, next){
  if(!req.isAuthenticated())
    res.send(401);
  else
    next();
};

//start express app
var app = express();
var port = process.env.PORT || 8080;
var sess = {
  secret: 'keyboard cat',
  cookie: {}
}



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/favicon.png'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended : true }));
app.use(bodyParser.json());
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(session(sess));
app.use(passport.initialize()); //init passport
app.use(passport.session()); //init passport session
app.use(express.static(path.join(__dirname, 'public')));

//dev error handler
if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
}

router.use(function(req, res, next){
  console.log('hi there, you want something?');
  next();
});

//unauthorized routing
app.get('/', function(req, res){
  res.render('index', {title: "Acme Financial"});
});

//authorized routing
//test for login
app.get('/loggedin', function(req, res){
  res.send(req.isAuthenticated() ? req.user : '0');
});

//route to log in
app.post('/login', passport.authenticate('local'), function(req, res){
  console.log(req, res);
  res.send(req.user);
});

//log out
app.post('/logout', function(req, res){
  res.logOut();
  res.send(200);
});

//edit user info routing goes here
app.get('/users/:guid', function(req, res){
  var user = db('users').chain().find({guid: req.params.guid }).value();
  res.json(user);
});

app.put('/users/:guid', function(req, res){
  db('users')
  .chain()
  .find({guid: req.params.guid})
  .assign({age: req.body.age, eyeColor: req.body.eyeColor, company: req.body.company, email: req.body.email, phone: req.body.phone, address: req.body.address, name:{first: req.body.name.first, last: req.body.name.last}})
  .value();
  res.send(200);
})

//make the app listen on the
// app.use('/api', router);

app.listen(port);
console.log("port's @ " + port);
