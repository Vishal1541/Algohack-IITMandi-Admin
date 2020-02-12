var adminUser = require('../models/admin_user');

exports.homePage = async (req, res, next) => {
  return res.send(req.session.passport.user);
}

exports.getUser = async (req, res) => {
  adminUser.findOne({ _id: req.session.passport.user })
    .then((user) => {
      // console.log([user, req.session])

      return res.send({ user: user })
    })
    .catch((err) => {
      return res.send(err);
    });
}
