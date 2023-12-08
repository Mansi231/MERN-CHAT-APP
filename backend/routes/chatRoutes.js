const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controller/chatControllers');

const router = express.Router()

router.route('/').post(protect,accessChat).get(protect,fetchChats)
router.route('/group').post(protect,createGroupChat)
router.route('/rename').put(protect,renameGroup)
router.route('/addToGroup').put(protect,addToGroup)
router.route('/removeFromGroup').put(protect,removeFromGroup)

module.exports = router   