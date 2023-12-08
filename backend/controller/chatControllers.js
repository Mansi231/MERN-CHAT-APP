const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req?.body

    if (!userId) return res.status(400)

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    }).populate('users', '-password').populate('latestMessage')

    isChat = await User.populate(isChat, { path: 'latestMessage.sender', select: 'name pic email' })

    if (isChat.length > 0) {
        res.send(isChat[0]);
    } else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const createdChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
                "users",
                "-password"
            );
            res.status(200).json(FullChat);
        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }

})

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req?.user?._id } } })
            .populate('users', '-password')
            .populate('groupAdmin', '-password')
            .populate({
                path: 'latestMessage',
                populate: {
                    path: 'sender', 
                    select: 'name pic email',
                },
            })
            .sort({ updatedAt: -1 })
            .then((result) => res.json(result));
    } catch (error) {
        return res.status(400).json(error);
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req?.body?.users || !req?.body?.name) return res.status(400).json({ message: 'Please fill all of the fields !' })
    var users = JSON.parse(req?.body?.users);
    if (users?.length < 2) return res.status(400).json({ message: 'More than 2 users are required to create a group chat' })
    users.push(req?.user)

    try {
        const groupChat = await Chat.create({
            chatName: req?.body?.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req?.user
        })

        const fullGroupChat = await Chat.findOne({ _id: groupChat?._id }).populate('users', '-password').populate('groupAdmin', '-password')
        return res.status(200).json(fullGroupChat)
    } catch (error) {
        return res.status(400).json(error)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req?.body

    const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true }).populate('users', '-password').populate('groupAdmin', 'password')
    if (!updatedChat) return res.status(400).json({ message: 'Chat not found!' })
    return res.status(200).json(updatedChat)
})

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req?.body

    const addedChat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true }).populate('users', '-password').populate('groupAdmin', '-password')
    if (!addedChat) return res.status(400).json({ message: 'User did not add to the group chat' })
    return res.status(200).json(addedChat)
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req?.body

    const removedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true }).populate('users', '-password').populate('groupAdmin', '-password')
    if (!removedChat) return res.status(400).json({ message: 'User did not add to the group chat' })
    return res.status(200).json(removedChat)
})

module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup }