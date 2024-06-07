var express = require('express');
var router = express.Router();
const { users, add_operator, actionDelete } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginAdmin, users);
router.post('/add_operator', isLoginAdmin, add_operator);
router.delete('/delete/:id', isLoginAdmin, actionDelete);
module.exports = router;