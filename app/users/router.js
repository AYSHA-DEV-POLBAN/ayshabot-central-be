var express = require('express');
var router = express.Router();
const { 
	index, 
	getUserById,
	getUserByEmail,
	add_operator, 
	actionDelete, 
	actionActivateAccountOperator, 
	actionDeactivateAccountOperator, 
	actionActivateEmailOperator, 
	actionDeactivateEmailOperator,
	actionEdit,
	actionChangePassword,
	passwordGenerator,
	jwtDecoder } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginAdmin, index);
router.get('/get_user_by_id', isLoginUser, getUserById);
router.get('/get_user_by_email', isLoginUser, getUserByEmail);
router.post('/add_operator', isLoginAdmin, add_operator);
router.delete('/delete/:id', isLoginAdmin, actionDelete);
router.put('/activate_account_operator/:id', isLoginAdmin, actionActivateAccountOperator);
router.put('/deactivate_account_operator/:id', isLoginAdmin, actionDeactivateAccountOperator);
router.put('/activate_email_operator/:id', isLoginAdmin, actionActivateEmailOperator);
router.put('/deactivate_email_operator/:id', isLoginAdmin, actionDeactivateEmailOperator);
router.put('/edit/:id', isLoginAdmin, actionEdit);
router.put('/change_password/:id', isLoginUser, actionChangePassword);
router.post('/password_generator', passwordGenerator);
router.post('/jwt_decoder', jwtDecoder);
module.exports = router;