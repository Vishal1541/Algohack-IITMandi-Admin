var express = require("express");
var router = express.Router();
var dashboard = require("../controls/dashboard");

router.get('/', dashboard.homePage);

module.exports = router;
