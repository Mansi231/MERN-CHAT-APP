import React, { memo, useContext, useState } from 'react'
import { ChatContext } from '../../context/ChatProvider';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '../reusable/Spinner';
import { createGroupChat, getSearchUsers } from '../../redux/actions/ChatAction';
import { AuthContext } from '../../context/AuthProvider';
import UserItemList from '../userItem/UserItemList';
import UserBadgeItem from '../userItem/UserBadgeItem';
import { ToastContainer, toast } from 'react-toastify'

const GroupChatModal = ({ openGroupModal, setOpenGroupModal }) => {

    const { user } = useContext(ChatContext)
    const dispatch = useDispatch()

    const [groupChatName, setGroupChatName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([])
    const [loadingUsers, setLoadingUsers] = useState(false);

    const fetchedChats = useSelector((s) => s.ChatReducer.fetch_chats)

    const modalStyles = openGroupModal
        ? 'fixed inset-0 flex items-center justify-center'
        : 'hidden';

    const handleSearch = (searchQuery) => {
        setLoadingUsers(true)
        setSearch(searchQuery)
        if (!searchQuery) return
        setTimeout(async () => {
            let data = await dispatch(getSearchUsers(searchQuery))
            setSearchResult(data)
            setLoadingUsers(false)
        }, 1000)

    }

    const handleSubmit = () => {
        if (!groupChatName || !selectedUsers) {
            toast.error('Something went wrong !', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        else{
            let data = {name:groupChatName,users:JSON.stringify(selectedUsers)}
            dispatch(createGroupChat(data,fetchedChats,setOpenGroupModal))
        }
    }

    const handleGroup = (userToAdd) => {
        const userExists = selectedUsers.some((user) => user._id === userToAdd._id);
        if (!userExists) {
            setSelectedUsers([...selectedUsers, userToAdd]);
        }
    }

    const handleDelete = (userToDelete) => {
        setSelectedUsers(selectedUsers.filter(({ _id }) => _id != userToDelete?._id))
    }

    return (
        <div className={`z-50 modal ${modalStyles}`}>
            <ToastContainer />
            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

            <div className="modal-content bg-white p-10 rounded shadow-lg z-50 w-96 text-center items-center relative">
                <i className="fa-solid fa-xmark absolute right-2 top-1 text-lg cursor-pointer" onClick={() => setOpenGroupModal(false)}></i>
                <p className='font-sans text-2xl tracking-wide font-light mb-3'>Create Group Chat</p>
                <div className='flex flex-col gap-3 my-4'>
                    <input type="text" value={groupChatName} placeholder='Group chat name'
                        onChange={(e) => setGroupChatName(e.target.value)} className='flex-grow border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm placeholder:text-gray-300' />
                    <input type="text" value={search} placeholder='Add Users eg: Mansi , Deep , Mihir'
                        onChange={(e) => handleSearch(e.target.value)} className='flex-grow border p-2 rounded focus:outline-sky-500 text-gray-600 text-sm placeholder:text-gray-300' />

                    {/* render selected users */}
                    <div className='flex gap-1 flex-wrap'>
                        {selectedUsers?.map((user) => {
                            return <React.Fragment key={user?._id}>
                                <UserBadgeItem user={user} handleFunction={() => handleDelete(user)} />
                            </React.Fragment>
                        })}
                    </div>

                    {/* render search users */}
                    {
                        loadingUsers ? <span>Loading...</span> : searchResult?.slice(0, 4).map((user) => {
                            return <React.Fragment key={user?._id}>
                                <UserItemList user={user} handleFunction={() => handleGroup(user)} />
                            </React.Fragment>
                        })
                    }

                    <button className='bg-sky-500 rounded p-2 text-white text-sm subpixel-antialiased flex justify-center align-middle w-40 self-end' onClick={handleSubmit}>
                        {/* {loading && <Spinner />}   */}
                        Create Group
                    </button>
                </div>
            </div>
        </div>
    )
}

export default memo(GroupChatModal)
