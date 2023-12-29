import React, { Fragment, memo, useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatProvider';
import UserBadgeItem from '../userItem/UserBadgeItem';
import { useDispatch } from 'react-redux'
import { addUserToGroup, getSearchUsers, removeUserFromGroup, renameGroupChat } from '../../redux/actions/ChatAction';
import Spinner from '../reusable/Spinner';
import UserItemList from '../userItem/UserItemList';
import { ToastContainer, toast } from 'react-toastify'

const UpdateGroupModal = ({ isOpen, onClose, profile }) => {

    const { user, selectedChat, setSelectedChat } = useContext(ChatContext)
    const dispatch = useDispatch()

    const [groupName, setGroupName] = useState(selectedChat?.chatName)
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])
    const [chatNameLoading, setChatNameLoading] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)

    const modalStyles = isOpen
        ? 'fixed inset-0 flex items-center justify-center'
        : 'hidden';

    const handleSearch = (searchQuery) => {
        setSearch(searchQuery)
        setLoadingUsers(true)
        if (!searchQuery) return
        setTimeout(async () => {
            let data = await dispatch(getSearchUsers(searchQuery))
            setSearchResult(data)
            setLoadingUsers(false)

        }, 1000)
    }

    const handleRemove = (u) => {
        if (selectedChat?.groupAdmin?._id !== user?._id && user?._id !== u?._id) {
            toast.info('Only admin can remove user!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return
        }
        
        let data = {
            chatId: selectedChat?._id,
            userId: u?._id
        }
        dispatch(removeUserFromGroup(data, setSelectedChat))
        if(user?._id == u?._id) setSelectedChat()
    }

    const handleAddUser = (u) => {
        if (selectedChat?.users?.find((x) => x?._id === u?._id)) {
            toast.info('User already exist!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return
        }
        if (selectedChat?.groupAdmin?._id !== user?._id && user?._id !== u?._id) {
            toast.info('Only admin can add a user!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return
        }
        let data = {
            chatId: selectedChat?._id,
            userId: u?._id
        }
        dispatch(addUserToGroup(data, setSelectedChat))
        setSearch('')
        setSearchResult([])
    }

    const handleRename = () => {
        setChatNameLoading(true)
        if (!groupName) return
        let data = { chatId: selectedChat?._id, chatName: groupName }
        setTimeout(() => {
            dispatch(renameGroupChat(data, setSelectedChat))
            setChatNameLoading(false)
            onClose()
        }, 1000)
    }

    return (
        <div className={`z-50 modal ${modalStyles}`}>
            <ToastContainer />
            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

            <div className="modal-content bg-white p-7 rounded shadow-lg z-50 w-96 text-center items-center relative">
                <i className="fa-solid fa-xmark absolute right-2 top-1 text-lg cursor-pointer" onClick={onClose}></i>
                <div className='flex flex-col justify-items-center items-center gap-4'>
                    <p className='font-sans text-2xl tracking-wide'>{selectedChat?.chatName}</p>

                    {/* user badge */}
                    <div className='flex flex-wrap gap-3 justify-start w-full'>
                        {
                            selectedChat?.users?.map((u) => {
                                return <Fragment key={u?._id}>
                                    <UserBadgeItem user={u} handleFunction={() => handleRemove(u)} />
                                </Fragment>
                            })
                        }
                    </div>

                    {/* Update group name */}
                    <div className='flex items-center w-full gap-2'>
                        <input type="text" value={groupName} placeholder='Group chat name'
                            onChange={(e) => setGroupName(e.target.value)} className='flex-grow border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm placeholder:text-gray-300' />
                        <button className={`bg-sky-500 rounded p-2 text-white text-sm subpixel-antialiased w-fit ${chatNameLoading ? 'opacity-50' : 'opacity-100'}`} onClick={handleRename} disabled={chatNameLoading}>
                            {chatNameLoading ? <Spinner /> : 'Update'}
                        </button>
                    </div>

                    {/* Add users */}
                    <input type="text" value={search} placeholder='Add Users eg: Mansi , Deep , Mihir'
                        onChange={(e) => handleSearch(e.target.value)} className='w-full  border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm placeholder:text-gray-300' />

                    {/* render search users */}
                    {
                        loadingUsers ? <span>Loading...</span> : searchResult?.length > 0 && <div className='flex flex-col gap-2 w-full h-40 overflow-auto'>
                            {
                                searchResult?.slice(0, 4).map((user) => {
                                    return <React.Fragment key={user?._id}>
                                        <UserItemList user={user} handleFunction={() => handleAddUser(user)} />
                                    </React.Fragment>
                                })
                            }
                        </div>
                    }

                    <button className='bg-red-600 rounded p-2 text-white text-sm subpixel-antialiased flex justify-center align-middle w-36 self-end'>
                        Leave Group
                    </button>

                </div>
            </div>
        </div>
    )
}

export default memo(UpdateGroupModal)
