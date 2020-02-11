const bcrypt = require('bcrypt');
var adminUser = require('../models/admin_user');

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
  const username = req.body.username;
  const password = req.body.password;
  adminUser.findOne({ username: username })
    .then((user) => {
      if (user === null) {
        // res.json("Invalid username!");
        return res.sendStatus(401).send();
      } else {
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            // res.json(err);
            return res.sendStatus(500).send();
          } else if (!match) {
            // res.json("Invalid password!");
            return res.sendStatus(401).send();
          } else {
            req.session.user = user;
            // res.json(req.session.user);
            return res.sendStatus(200).send();
          }
        })
      }
    })
    .catch((err) => {
      return res.sendStatus(500).send();
    })
}

exports.postLogout = async (req, res, next) => {
  if (!req.session.user) {
    return res.sendStatus(401).send();
  } else {
    req.session.destroy((err) => {
      if (err) {
        return res.sendStatus(500).send();
      } else {
        return res.sendStatus(200).send();
      }
    })
  }
}
