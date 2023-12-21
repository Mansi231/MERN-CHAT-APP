const express = require('express');
const { registerUser,authUser, allUsers, authGoogleLogin } = require('../controller/userControllers');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(registerUser).get(protect,allUsers);
router.post('/login',authUser);
router.post('/socialLogin',authGoogleLogin)

module.exports = router