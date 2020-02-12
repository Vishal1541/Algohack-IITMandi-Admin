const bcrypt = require('bcrypt');
var adminUser = require('../models/admin_user');
const passport = require('passport');

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
