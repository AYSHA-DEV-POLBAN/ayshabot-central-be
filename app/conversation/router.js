var express = require('express');
var router = express.Router();
const { 
	index,
	actionCreated,
	actionDelete } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.post('/create', actionCreated);
router.delete('/delete/:id', isLoginUser, actionDelete);
module.exports = router;