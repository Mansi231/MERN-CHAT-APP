import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { getSender, getSenderProfile } from '../components/config/ChatLogics';
import ProfileModal from '../components/miscellaneous/ProfileModal';
import UpdateGroupModal from '../components/miscellaneous/UpdateGroupModal';
import Spinner from '../components/reusable/Spinner';
import { useDispatch } from 'react-redux';
import { createNotification, fetchChatMessages, sendMessageToChat } from '../redux/actions/ChatAction';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'

// const ENDPOINT = 'https://chit-chat-swj9.onrender.com'
const ENDPOINT = 'http://localhost:5173'
var socket, selectedChatCompare;

const ChatBox = () => {

    const dispatch = useDispatch()
    const { user, selectedChat, notification, setNotification, setSelectedChat } = useContext(ChatContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false)

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)

    useEffect(() => {
        socket = io(ENDPOINT)
        socket.emit('setup', user)
        socket.on('connected', () => setSocketConnected(true))
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, [socket])


    const sendMessage = async () => {
        let data = {
            chatId: selectedChat?._id,
            content: newMessage
        }
        setNewMessage('')
        socket.emit('stop typing', selectedChat?._id)
        let resData = await dispatch(sendMessageToChat(data))
        if (resData) {
            setMessages((prevMessages) => [...prevMessages, resData]);
            socket.emit('new message', resData)
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) return
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat?._id)
        }

        let lastTypingTime = new Date().getTime()
        let timerLength = 3000
        setTimeout(() => {
            var currTime = new Date().getTime()
            let timeDiff = currTime - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                setTyping(false)
                socket.emit('stop typing', selectedChat?._id)
            }
        }, timerLength)
    }

    const fetchMessages = () => {
        setLoading(true)
        if (!selectedChat) return
        setTimeout(async () => {
            let resMessages = await dispatch(fetchChatMessages(selectedChat?._id))
            setMessages(resMessages)
            setLoading(false)
            socket.emit('join chat', selectedChat?._id)
        }, 1000)
    }



    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        const handleReceivedMessage = (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare?._id !== newMessageReceived?.chat?._id) {
                // give notification
                const existingIndex = notification.findIndex(obj => obj.chatId?._id === newMessageReceived?.chat?._id);
                let notify = { message: newMessageReceived, chatId: newMessageReceived?.chat, userId: user?._id }
                dispatch(createNotification({ chatId: newMessageReceived?.chat?._id, message: newMessageReceived?._id, userId: user?._id }));
                if (existingIndex === -1) {
                    // If not present, add the new object to the array
                    setNotification([...notification, notify])

                } else {
                    let arr = notification
                    // If present, update the existing object with the new data
                    arr[existingIndex] = notify;
                    setNotification(arr)
                    fetchMessages();

                }
              
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        };

        socket.on('message received', handleReceivedMessage);

        // Clean up the subscription when the component unmounts
        return () => {
            socket.off('message received', handleReceivedMessage);
        };
    })


    return (
        <>
            {selectedChat ? <div className='flex flex-col gap-4 px-2 py-1 h-full'>

                {/* header */}
                <div className='flex justify-between items-center h-fit'>
                    <button className={`bg-gray-200 px-3 py-2 h-fit w-fit text-black rounded ${selectedChat ? 'md:hidden' : 'block'}`} onClick={() => setSelectedChat()}>
                        <i className="fa-solid fa-arrow-left-long text-lg"></i>
                    </button>
                    <p className='text-xl font-light tracking-wide text-cyan-950'>{!selectedChat?.isGroupChat ? getSender(user, selectedChat?.users)?.toUpperCase() : selectedChat?.chatName?.toUpperCase()}</p>
                    <button className='bg-gray-200 px-3 py-2 rounded' onClick={() => !selectedChat?.isGroupChat ? setIsModalOpen(true) : setIsGroupModalOpen(true)}>
                        <i className="fa-solid fa-eye"></i>
                    </button>

                    <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={getSenderProfile(user, selectedChat?.users)} />
                    <UpdateGroupModal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} profile={getSenderProfile(user, selectedChat?.users)} />

                </div>

                {/* chat content -- messages */}
                <div className='bg-gray-200 p-3 overflow-hidden rounded h-full'>
                    {
                        loading ?
                            <div className='flex justify-center overflow-hidden w-full h-full items-center'>
                                <Spinner border={'border-sky-800'} />
                            </div> :
                            <div className='h-full w-full relative'>
                                <div className='overflow-auto pb-12 h-full '>
                                    <ScrollableChat messages={messages} isTyping={isTyping} />
                                </div>
                                <div className='w-full absolute bottom-0 left-0 right-0 flex gap-3 z-0'>
                                    <input type="text" onKeyDown={(e) => {
                                        if (e.keyCode === 13) {
                                            sendMessage()
                                        }
                                    }} value={newMessage} placeholder='Enter a message ..'
                                        onChange={(e) => typingHandler(e)} className='flex-grow border p-2 rounded focus:outline-cyan-700 text-gray-600 text-sm placeholder:text-gray-300 w-full ' />
                                    <button className='bg-white px-3 rounded' onClick={() => sendMessage()}>
                                        <i className="fa-solid fa-paper-plane text-cyan-700"></i>
                                    </button>
                                </div>
                            </div>
                    }
                </div>

            </div> :
                <span className='text-2xl text-gray-600'>Click user to start chat</span>
            }
        </>
    )
}

export default ChatBox
