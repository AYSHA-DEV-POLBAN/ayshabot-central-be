var express = require('express');
var router = express.Router();
const { index,actionCreated,actionDelete,actionEdit} = require('./controller');
const multer = require('multer');
const os = require('os')
router.get('/', index);
router.post('/create', multer({ dest: os.tmpdir() }).single('image'), actionCreated);
router.delete('/delete/:id', actionDelete);
router.put('/edit/:id',multer({ dest: os.tmpdir() }).single('image'), actionEdit);
module.exports = router;