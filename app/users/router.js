var express = require('express');
var router = express.Router();
const { users, add_operator } = require('./controller');

router.get('/', users);
router.post('/add_operator', add_operator);

module.exports = router;