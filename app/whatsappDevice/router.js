var express = require('express');
var router = express.Router();
const multer = require('multer');
const os = require('os');

const { 
	index,
	getWhatsappDeviceById,
	actionCreatedUploadFile,
	actionCreated,
	actionDelete,
	actionEdit } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.post('/create_with_upload_file', multer({ dest: os.tmpdir() }).single('qr_wa'), actionCreatedUploadFile);
router.get('/get_whatsapp_device_by_id/:id', isLoginUser, getWhatsappDeviceById);
router.post('/create', isLoginUser, actionCreated);
router.delete('/delete/:id', isLoginUser, actionDelete);
router.put('/edit/:id', isLoginUser, actionEdit);
module.exports = router;