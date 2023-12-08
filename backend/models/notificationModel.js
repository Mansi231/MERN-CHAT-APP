const mongoose = require('mongoose')

const notificationModal = mongoose.Schema({
    chatId:{type:mongoose.Schema.Types.ObjectId,require:true,ref:"Chat"},
    message:{type:mongoose.Schema.Types.ObjectId,ref:'Message'},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'}
})

const Notification = mongoose.model('Notification',notificationModal)
module.exports = Notification