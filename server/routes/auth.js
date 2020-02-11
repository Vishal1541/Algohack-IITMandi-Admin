var express = require("express");
var router = express.Router();
var auth = require("../controls/auth");

router.post('/signup', auth.postSignUp);

router.post('/login', auth.postLogin);

router.post('/logout', auth.postLogout);

module.exports = router;
