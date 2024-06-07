var express = require('express');
var router = express.Router();
const { 
	index,
	actionCreated,
	actionDelete,
	actionEdit } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.post('/create', isLoginUser, actionCreated);
router.delete('/delete/:id', isLoginUser, actionDelete);
router.put('/edit/:id', isLoginUser, actionEdit);
module.exports = router;