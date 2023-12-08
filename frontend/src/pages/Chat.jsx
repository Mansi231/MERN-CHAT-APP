import React, { useContext, useEffect } from 'react'
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from './MyChats';
import ChatBox from './ChatBox';
import { ChatContext } from '../context/ChatProvider';
import { useDispatch } from 'react-redux';
import { fetchUserNotifications } from '../redux/actions/ChatAction';
import { useLocation } from 'react-router-dom';
import { ROUTES } from '../services/routes';

const Chat = () => {

  const { selectedChat, setNotification, notification } = useContext(ChatContext)
  const dispatch = useDispatch()
  const {pathname} = useLocation()

  const getNotifications =async () => {
    let data = await dispatch(fetchUserNotifications())
    if (data) setNotification(data)
  }

  useEffect(() => {
    if(pathname == ROUTES.CHATS)getNotifications()
  }, [])

  return (
    <div className='w-full  inset-0'>
      <SideDrawer />
      <div className='absolute z-0 top-16 mt-7 left-5 right-5 bottom-5 flex gap-5 rounded-lg border-slate-500 justify-between'>
        {/* <div className='absolute z-0 top-5 left-5 right-5 bottom-5 flex gap-5 rounded-lg border-slate-500 justify-between'> */}
        <div className={`bg-slate-100 pb-4 overflow-auto rounded w-full md:basis-4/12 lg:3/12 px-3 ${selectedChat ? 'hidden md:block' : 'block'}`}><MyChats /></div>
        <div className={`bg-slate-100 flex-grow rounded px-3 py-4 md:block ${selectedChat ? 'block' : 'hidden'}`}><ChatBox /></div>
        {/* </div> */}
      </div>
    </div>
  )
}

export default Chat
