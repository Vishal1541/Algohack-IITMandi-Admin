var adminUser = require('../models/admin_user');

exports.homePage = async (req, res, next) => {
  if(!req.session.user) {
    return res.sendStatus(401).send();
  }
  // return res.json("Welcome" + req.session.user.username);
  return res.sendStatus(200).send();
}
