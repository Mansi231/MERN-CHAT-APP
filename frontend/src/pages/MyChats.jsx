import React, { useContext, useEffect, useState } from 'react'
import { ChatContext } from '../context/ChatProvider'
import { useDispatch, useSelector } from 'react-redux';
import { fetchChats, removeNotification } from '../redux/actions/ChatAction';
import SkeletonLoader from '../components/reusable/SkeletonLoader';
import { AuthContext } from '../context/AuthProvider';
import { getSender } from '../components/config/ChatLogics';
import GroupChatModal from '../components/miscellaneous/GroupChatModal';

const MyChats = () => {

  const [openGroupModal, setOpenGroupModal] = useState(false)

  const { selectedChat, user, setSelectedChat, notification, setNotification } = useContext(ChatContext);
  const { setLoading, loading } = useContext(AuthContext)
  const dispatch = useDispatch()
  const fetchedChats = useSelector((s) => s.ChatReducer.fetch_chats)

  const fetchAllChats = () => {
    setLoading(true)
    try {
      setTimeout(() => {
        dispatch(fetchChats(setLoading))
      }, 1000)
    } catch (error) {
      console.log(error, ' :: error fetching chats')
    }
  }

  useEffect(() => {
    fetchAllChats()
  }, [])

  const navigateToChat = (chat) => {
    setSelectedChat(chat)
    if (notification?.length > 0) {

      setNotification(notification.filter((n) => n?.chatId?._id !== chat?._id))

      let {_id} = notification.find((n)=>n?.chatId?._id === chat?._id)
      if(_id)dispatch(removeNotification(_id))

    }
  }

  return (
    <>
      <div className='flex justify-between z-10 sticky top-0 bg-slate-100 py-4 items-center '>
        <p className='lg:text-2xl font-light text-gray-700 text-lg'>My Chats</p>
        <button className='bg-gray-200 px-3 py-2 rounded lg:text-sm text-sm' onClick={() => setOpenGroupModal(true)}>New Group Chat</button>
        <GroupChatModal openGroupModal={openGroupModal} setOpenGroupModal={setOpenGroupModal} />

      </div>
      {
        loading ? <SkeletonLoader /> : <div className=''>
          {
            fetchedChats?.map((chat) => {
              return <div key={chat?._id} className={`${(selectedChat?._id == chat?._id) ? 'bg-cyan-700' : 'bg-gray-200'}  px-2 py-1 flex flex-col gap-2 my-3 rounded cursor-pointer`} onClick={() => navigateToChat(chat)}>
                <p className={`${(selectedChat?._id == chat?._id) ? 'text-white' : 'text-black'} text-base `}>{!chat?.isGroupChat ? getSender(user, chat?.users) : chat?.chatName}</p>
                {
                  chat?.latestMessage && (
                    <p className={`text-sm ${selectedChat ? 'text-slate-300' : 'text-slate-600'}`}>
                      {chat?.latestMessage?.sender?._id !== user?._id && <b>{chat?.latestMessage?.sender?.name} : </b>}
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </p>
                  )
                }
              </div>
            })
          }
        </div>
      }
    </>
  )
}

export default MyChats
