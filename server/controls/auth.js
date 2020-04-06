const bcrypt = require('bcrypt');
var adminUser = require('../models/admin_user');
const passport = require('passport');
const axios = require('axios');

exports.postSignUp = async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = { username: req.body.username, password: hashedPassword };
  adminUser.countDocuments({})
    .then((cnt) => {
      if (cnt === 0) {
        const newAdmin = new adminUser(user);
        newAdmin.save((err) => {
          // res.json(err);
          return res.sendStatus(500).send();
        })
        // res.json(newAdmin);
        return res.sendStatus(201).send();
      }
      else {
        // res.json('Admin already exists');
        return res.sendStatus(404).send();
      }
    })
    .catch((err) => {
      return res.sendStatus(500).send();
    })
};

exports.postLogin = async (req, res, next) => {

  // var nodemailer = require('nodemailer');

  // var transporter = nodemailer.createTransport({
  //   host: 'smtp.gmail.com',
  //   port: 587,
  //   secure: false,
  //   requireTLS: true,
  //   auth: {
  //     user: 'b16040@students.iitmandi.ac.in',
  //     pass: 'password'
  //   }
  // });

  // var mailOptions = {
  //   from: 'b16040@students.iitmandi.ac.in',
  //   to: 'b16040@students.iitmandi.ac.in',
  //   subject: '2 Sending Email using Node.js',
  //   text: 'Second email test! \n link: www.google.com'
  // };

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(400).send([user, 'Cannot log in', info]);
    }

    req.login(user, err => {
      res.send('Logged in');
    });
  })(req, res, next);
}

exports.postLogout = async (req, res, next) => {
  req.logout();
  return res.send('Logged out');
}

exports.makeSubmissionJudge0 = async (req, res, next) => {
  req.body.stdin = req.body.stdin.replace(/\r\n/g, "\n");
  await axios.post('http://sntc.iitmandi.ac.in:3000/submissions/?base64_encoded=false&wait=true', req.body)
    .then((response) => {
      return res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
    })
}
