var adminUser = require('../models/admin_user');
var problems = require('../models/problems');
var contest = require('../models/contest');

exports.homePage = async (req, res, next) => {
  return res.send(req.session.passport.user);
}

exports.getUser = async (req, res) => {
  adminUser.findOne({ _id: req.session.passport.user })
    .then((user) => {
      return res.send({ user: user })
    })
    .catch((err) => {
      return res.send(err);
    });
}

exports.isProblemCodeAvailable = async (req, res) => {
  problems.findOne({ qID: req.params.qID })
    .then((problem) => {
      if (problem === null) {
        return res.send({ exists: false });
      } else {
        return res.send({ exists: true });
      }
    })
    .catch((err) => {
      return res.send(err);
    })
}

exports.createProblem = async (req, res) => {
  problems.findOne({ qID: req.body.qID })
    .then((problem) => {
      if (problem === null) {
        const new_problem = new problems(req.body);
        new_problem.save(function (err) {
          if (err) {
            return res.status(500).send({ message: err });
          } else {
            return res.status(200).send({ message: "SUCCESS" });
          }
        });
      } else {
        return res.status(401).send({ message: "Problem code already available" });
      }
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.getAllProblems = async (req, res) => {
  problems.find({})
    .then((all_problems) => {
      return res.status(200).send(all_problems);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.getProblemFromqID = async (req, res) => {
  const qID = req.params.qID;
  problems.findOne({ qID: qID })
    .then((problem) => {
      return res.status(200).send(problem);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.editProblem = async (req, res) => {
  problems.findOneAndUpdate({ qID: req.body.qID }, req.body, { upsert: true })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.deleteProblem = async (req, res) => {
  problems.findOneAndDelete({ qID: req.params.qID })
    .then((result) => {
      return res.status(200).send(result);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.editContestSetting = async (req, res) => {
  const edited_contest = new contest(req.body);
  contest.remove({})
    .then(() => {
      edited_contest.save(function (err) {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(200).send({ message: "Contest settings edited" });
        }
      });
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}

exports.getContestSetting = async (req, res) => {
  contest.findOne({})
    .then((setting) => {
      return res.status(200).send(setting);
    })
    .catch((err) => {
      return res.status(500).send(err);
    })
}
