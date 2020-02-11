const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
const configDb = require('./config/database');
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/dashboard');

mongoose.Promise = global.Promise;
mongoose.connect(configDb.database, { useNewUrlParser: true });
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
app.use(session({
  secret: "codeall_secret_session",
  resave: false,
  saveUninitialized: true
}));

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

app.use('/api/auth', authRoute);
app.use('/api/dashboard', dashboardRoute);

// Handle production
if (process.env.NODE_ENV === 'production') {
  // Static folder
  app.use(express.static(__dirname + '/public/'));

  // Handle single page application
  app.get(/.*/, (req, res, next) => {
    res.sendFile(__dirname + '/public/index.html');
  });
}
