import React, { memo, useContext, useEffect, useRef } from 'react'
import { ChatContext } from '../context/ChatProvider'
import '../styles/ChatBoxStyle.css'
import { isLastMessage, isSameSender } from '../components/config/ChatLogics'
import TypingIndicator from '../animations/TypingIndicator'

const ScrollableChat = ({ messages, isTyping }) => {

    const { user, selectedChat } = useContext(ChatContext)
    const chatContainerRef = useRef(null);

    useEffect(() => {
        // Scroll to the bottom when messages change
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages?.length, isTyping]);

    return (
        <div
            ref={chatContainerRef}
            className='overflow-auto h-full w-full px-3 flex flex-col gap-3 custom-scroll'>
            {
                messages && messages?.map((x, i) => {
                    return (
                        <div className={`flex gap-3 ${x?.sender?._id == user?._id ? 'self-end' : 'self-start'}`} key={x?._id}>
                            {
                                !(isSameSender(messages, x, i, user?._id) && isLastMessage(messages, i, user?._id)) ? (
                                    x?.sender?._id != user?._id && <img src={x?.sender?.pic} alt="image" className='h-7 w-7 rounded-full object-cover' />
                                ) : <div className='h-7 w-7 rounded-full'></div>
                            }
                            <div className={`px-3 py-1 ${x?.sender?._id == user?._id ? 'bg-white' : 'bg-cyan-600'} rounded-full w-fit min-w-fit `} >
                                <p className={`${x?.sender?._id == user?._id ? 'text-black' : 'text-white'} text-sm font-serif tracking-wide`}>{x?.content}</p>
                            </div>

                        </div>
                    )
                })
            }
            {/* 
            { isTyping && <div className={`flex gap-3 self-start`} >
                <div className={`px-3 py-2 bg-cyan-600 rounded-full w-fit min-w-fit`} >
                    <TypingIndicator/>
                </div>
            </div>} */}
            {isTyping&&<div className={`self-start`}>
                <div className='h-7 w-7 rounded-full'></div>
                <div className={`px-3 py-2 bg-cyan-600 rounded-full w-fit min-w-fit`} >
                    <TypingIndicator />
                </div>
            </div>}
        </div>
    )
}

export default memo(ScrollableChat)
