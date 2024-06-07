var express = require('express');
var router = express.Router();
const { 
	users, 
	add_operator, 
	actionDelete, 
	actionActivateAccountOperator, 
	actionDeactivateAccountOperator, 
	actionActivateEmailOperator, 
	actionDeactivateEmailOperator,
	actionEdit } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginAdmin, users);
router.post('/add_operator', isLoginAdmin, add_operator);
router.delete('/delete/:id', isLoginAdmin, actionDelete);
router.put('/activate_account_operator/:id', isLoginAdmin, actionActivateAccountOperator);
router.put('/deactivate_account_operator/:id', isLoginAdmin, actionDeactivateAccountOperator);
router.put('/activate_email_operator/:id', isLoginAdmin, actionActivateEmailOperator);
router.put('/deactivate_email_operator/:id', isLoginAdmin, actionDeactivateEmailOperator);
router.put('/edit/:id', isLoginAdmin, actionEdit);
module.exports = router;