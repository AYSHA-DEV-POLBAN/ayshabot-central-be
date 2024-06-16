var express = require('express');
var router = express.Router();
const { 
	index,
	getClientById,
	countDay,
	countWeek,
	countWeekInMonth,
	countWeekInYear,
	countMonth,
	countMonthInYear,
	countYear,
	actionCreated,
	actionDelete,
	actionEdit } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.get('/get_client_by_id/:id', isLoginUser, getClientById);
router.get('/count-day', isLoginUser, countDay);
router.get('/count-week', isLoginUser, countWeek);
router.get('/count-week-in-month', isLoginUser, countWeekInMonth);
router.get('/count-week-in-year', isLoginUser, countWeekInYear);
router.get('/count-month', isLoginUser, countMonth);
router.get('/count-month-in-year', isLoginUser, countMonthInYear);
router.get('/count-year', isLoginUser, countYear);
router.post('/create', actionCreated);
router.delete('/delete/:id', isLoginUser, actionDelete);
router.put('/edit/:id', isLoginUser, actionEdit);
module.exports = router;