var express = require('express');
var router = express.Router();
const { 
	index,
	getCategoryInformationById,
	actionCreated,
	actionDelete,
	actionEdit } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.get('/get_category_information_by_id/:id', isLoginUser, getCategoryInformationById);
router.post('/create', isLoginUser, actionCreated);
router.delete('/delete/:id', isLoginUser, actionDelete);
router.put('/edit/:id', isLoginUser, actionEdit);
module.exports = router;