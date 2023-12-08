const express = require('express')
const { protect } = require('../middlewares/authMiddleware');
const {accessNotification , fetchNotifications, removeNotification} = require('../controller/notificationController')

const router = express.Router()

router.route('/').post(protect,accessNotification).get(protect,fetchNotifications)
router.route('/:id').get(protect,removeNotification)

module.exports = router


 