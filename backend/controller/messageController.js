const asyncHandler = require("express-async-handler");
const Message = require('../models/messageModel');
const Chat = require("../models/chatModel");
const Notification = require("../models/notificationModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req?.body
    if (!chatId || !content) return res.sendStatus(400).json({ message: 'Invalid data passed to the request!' })

    var newMessage = {
        content, sender: req?.user?._id, chat: chatId
    }

    try {
        let message = await Message.create(newMessage);

        message = await Message.findById(message._id).populate('sender', '-password').populate({
            path: 'chat',
            populate: {
                path: 'users',
                select: 'name pic email',
            },
        }).exec();
        await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
        await Notification.findByIdAndUpdate(req.body.chatId, { message: message });
        res.status(201).json(message);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error', error });

    }
})

const allMessages = asyncHandler(async (req, res) => {
    try {
        const message = await Message.find({chat:req?.params?.chatId}).populate('sender','-password').populate('chat').exec()
        return res.status(200).json(message)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
})

module.exports = { sendMessage, allMessages }