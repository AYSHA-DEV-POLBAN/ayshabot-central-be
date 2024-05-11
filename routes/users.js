var express = require('express');
var router = express.Router();
const User = require('../app/users/model')
/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    const user = await User.findAll();
    console.log('user',user);
    res.status(200).json({ data: user });
} catch (err) {
    res.status(500).json({message: err.message || 'internal server error'})
}
  
});
module.exports = router;
