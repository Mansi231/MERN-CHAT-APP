const asyncHandler = require('express-async-handler');
const Notification = require('../models/notificationModel')

const fetchNotifications = asyncHandler(async (req, res) => {
    try {
        const result = await Notification.find({ userId: req?.user?._id })
            .populate({
                path:'chatId',
                populate:{
                    path:'users',
                    select:'name pic email'
                }
            })
            .populate('message')
            .exec();

        return res.json(result);
    } catch (error) {
        return res.status(400).json(error);
    }
});

const accessNotification = asyncHandler(async (req, res) => {
    const { userId, chatId } = req?.body

    if (!userId || !chatId) return res.status(400)

    var isNotification = await Notification.find({ chatId: chatId })
    if (isNotification?.length > 0) return res.json(isNotification)
    else {
        var notificationData = {
            chatId: chatId,
            userId: userId,
            message: req?.body?.message
        };

        try {
            const createdNotification = await Notification.create(notificationData);
            const FullChat = await Notification.findOne({ _id: createdNotification._id }).populate(
                "userId",
                "-password"
            ).populate('chatId');
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

})

const removeNotification = asyncHandler(async (req,res)=>{
    try {
        const result = await Notification.findByIdAndDelete(req?.params?.id)
        return res.status(200).json({message:"deleted successfully",result})
    } catch (error) {
        return res.status(400).json(error)
    }
})

module.exports = { fetchNotifications, accessNotification ,removeNotification}