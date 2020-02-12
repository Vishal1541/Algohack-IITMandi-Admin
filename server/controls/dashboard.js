var adminUser = require('../models/admin_user');
var problems = require('../models/problems');

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
  console.log("in createProblem");
  problems.findOne({ qID: req.body.qID })
    .then((problem) => {
      if (problem === null) {
        const new_problem = new problems({
          qID: req.body.qID,
          name: req.body.name,
          description: req.body.description,
          inputFormat: req.body.inputFormat,
          outputFormat: req.body.outputFormat,
          constraints: req.body.constraints,
          sampleInput: req.body.sampleInput,
          sampleOutput: req.body.sampleOutput,
          timeLimit: req.body.timeLimit,
          correctSolution: req.body.correctSolution,
          incorrectSolution: req.body.incorrectSolution,
          hint: req.body.hint,
          points: req.body.points
        });
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
