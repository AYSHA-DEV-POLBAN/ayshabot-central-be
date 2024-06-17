var express = require('express');
var router = express.Router();
const { 
	index,
	getRoleById,
	actionCreated,
	actionDelete,
	actionEdit } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginAdmin, index);
router.get('/get_role_by_id/:id', isLoginUser, getRoleById);
router.post('/create', isLoginAdmin, actionCreated);
router.delete('/delete/:id', isLoginAdmin, actionDelete);
router.put('/edit/:id', isLoginAdmin, actionEdit);
module.exports = router;