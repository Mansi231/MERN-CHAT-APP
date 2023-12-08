import { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "../services/routes";

export const ChatContext = createContext()

const ChatProvider = ({children}) =>{

    const [user,setUser] = useState()
    const [selectedChat,setSelectedChat] = useState()
    const [chats,setChats] = useState([])
    const [notification,setNotification] = useState([])

    const navigate = useNavigate()
    const { pathname } = useLocation();

    useEffect(()=>{
        let userInfo = JSON.parse(localStorage.getItem('userInfo'))
        setUser(userInfo)
    },[pathname])

    return (
        <ChatContext.Provider value={{user,setUser,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>{children}</ChatContext.Provider>
    )
}
        
export default ChatProvider