var express = require('express');
var router = express.Router();
const { 
	index,
	getCommandById,
	actionCheckResponseCommand,
	actionCreated,
	actionDelete,
	actionEdit,
	actionActivateCommand,
	actionDeactivateCommand } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.get('/get_command_by_id/:id', isLoginUser, getCommandById);
router.post('/check_response_command', actionCheckResponseCommand);
router.post('/create', isLoginUser, actionCreated);
router.delete('/delete/:id', isLoginUser, actionDelete);
router.put('/edit/:id', isLoginUser, actionEdit);
router.put('/activate_command/:id', isLoginUser, actionActivateCommand);
router.put('/deactivate_command/:id', isLoginUser, actionDeactivateCommand);
module.exports = router;