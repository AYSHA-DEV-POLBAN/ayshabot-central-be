var express = require('express');
var router = express.Router();
const { index,actionCreated,actionDelete,actionEdit} = require('./controller');
const { isLoginUser } = require('../middleware/auth');

router.get('/',isLoginUser, index);
router.post('/create', actionCreated);
router.delete('/delete/:id', actionDelete);
router.put('/edit/:id', actionEdit);
module.exports = router;