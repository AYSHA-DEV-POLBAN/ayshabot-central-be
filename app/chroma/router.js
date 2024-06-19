var express = require('express');
var router = express.Router();
const { 
	index,
	getChromaById,
	actionReset,
	actionCreated,
	actionDelete,
	actionEdit } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.get('/get_chroma_by_id/:id', isLoginUser, getChromaById);
router.get('/reset/', isLoginUser, actionReset);
router.post('/create', actionCreated);
router.put('/edit/:id', isLoginUser, actionEdit);
module.exports = router;