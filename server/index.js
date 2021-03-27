const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

var users = require('./models/users');
var problems = require('./models/problems');
const configDb = require('./config/database');
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');
const authMiddleware = require('./middleware/auth_middleware');

mongoose.Promise = global.Promise;
mongoose.connect(configDb.database, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var db = mongoose.connection;

db.once('open', () => {
  console.log('Mongo db connected!');
});

db.on('error', (err) => {
  console.log(err);
});

var app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "30MB", extended: true }));

app.use(cookieSession({
  name: 'user-session',
  keys: ['authrandomkey'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use(passport.initialize());

app.use(passport.session());

if (process.env.NODE_ENV !== 'production') {
  delete process.env['http_proxy'];
  delete process.env['HTTP_PROXY'];
  delete process.env['https_proxy'];
  delete process.env['HTTPS_PROXY'];
}

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password"
    },

    (username, password, done) => {
      users.findOne({ username: username })
        .then((user) => {
          if (user === null) {
            done(null, false, { message: 'Incorrect username or password' });
          } else {
            bcrypt.compare(password, user.password, (err, match) => {
              if (err) {
                done(null, false, { message: err });
              } else if (!match) {
                done(null, false, { message: 'Incorrect username or password' });
              } else if (!user.isAdmin) {
                done(null, false, { message: 'You are not the admin' });
              } else {
                done(null, user);
              }
            })
          }
        })
        .catch((err) => {
          done(null, false, { message: err });
        })
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id)
});

passport.deserializeUser((id, done) => {
  users.findOne({ _id: id })
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(null, false, { message: err });
    })
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use('/api/auth', authRoute);
app.use('/api/dashboard', authMiddleware, dashboardRoute);
app.get('/api/local', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.send({ _id: null });
  } else {
    return res.send({ _id: req.session.passport.user });
  }
})

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle single page application
  app.get(/.*/, (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
  });
}
