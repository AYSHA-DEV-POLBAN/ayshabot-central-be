var express = require('express');
var router = express.Router();
const multer = require('multer');
const os = require('os');

const { 
	index,
	getInformationById,
	actionCreated,
	actionCreatedUploadFile,
	actionDelete,
	actionEdit,
	actionEditUploadFile,
	actionActivateInformation,
	actionDeactivateInformation } = require('./controller');
const { isLoginAdmin, isLoginUser } = require('../middleware/auth');

router.get('/', isLoginUser, index);
router.get('/get_information_by_id/:id', isLoginUser, getInformationById);
router.post('/create', isLoginUser, actionCreated);
router.post('/create_with_upload_file', multer({ dest: os.tmpdir() }).single('document'), actionCreatedUploadFile);
router.delete('/delete/:id', isLoginUser, actionDelete);
router.put('/edit/:id', isLoginUser, actionEdit);
router.put('/edit_with_upload_file/:id', multer({ dest: os.tmpdir() }).single('document'), actionEditUploadFile);
router.put('/activate_information/:id', isLoginUser, actionActivateInformation);
router.put('/deactivate_information/:id', isLoginUser, actionDeactivateInformation);
module.exports = router;