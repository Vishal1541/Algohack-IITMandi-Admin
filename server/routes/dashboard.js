var express = require("express");
var router = express.Router();
var dashboard = require("../controls/dashboard");
const authMiddleware = require('../middleware/auth_middleware');

router.get('/', dashboard.homePage);

router.get('/user', authMiddleware, dashboard.getUser);

module.exports = router;
