var express = require('express');
var router = express.Router();
const { users } = require('./controller');
router.get('/', users);

module.exports = router;