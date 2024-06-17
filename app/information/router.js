var express = require('express');
var router = express.Router();
const { 
	index,
	getInformationById,
	actionCreated,
	actionDelete,
	actionEdit,
	actionActivateInformation,
	actionDeactivateInformation } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.get('/get_information_by_id/:id', isLoginUser, getInformationById);
router.post('/create', isLoginUser, actionCreated);
router.delete('/delete/:id', isLoginUser, actionDelete);
router.put('/edit/:id', isLoginUser, actionEdit);
router.put('/activate_information/:id', isLoginUser, actionActivateInformation);
router.put('/deactivate_information/:id', isLoginUser, actionDeactivateInformation);
module.exports = router;