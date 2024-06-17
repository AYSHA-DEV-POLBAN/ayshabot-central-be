var express = require('express');
var router = express.Router();
const { 
	index,
	getLogHistoryById,
	actionCreated,
	actionDelete } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginAdmin, index);
router.get('/get_log_history_by_id/:id', isLoginUser, getLogHistoryById);
router.post('/create', actionCreated);
router.delete('/delete/:id', isLoginAdmin, actionDelete);
module.exports = router;