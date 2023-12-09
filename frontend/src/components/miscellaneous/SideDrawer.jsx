import React, { useContext, useState } from 'react'
import ProfileModal from './ProfileModal';
import { ChatContext } from '../../context/ChatProvider'
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../services/routes';
import { ToastContainer, toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { AuthContext } from '../../context/AuthProvider';
import { FETCH_CHATS, createChat, getSearchUsers, removeNotification } from '../../redux/actions/ChatAction';
import SkeletonLoader from '../reusable/SkeletonLoader';
import UserItemList from '../userItem/UserItemList';
import { getSender } from '../config/ChatLogics';

const SideDrawer = () => {

    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false)

    const [searchResult, setSearchResult] = useState([]);
    const [isOpen, setIsOpen] = useState(false)
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user, setSelectedChat, notification, setNotification } = useContext(ChatContext)

    const fetchedChats = useSelector((s) => s.ChatReducer.fetch_chats)

    const handleLogOut = () => {

        let isToastOpen = true;

        localStorage.clear();
        toast.error('Logout Successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: (props) => {
                console.log(isToastOpen, '---first')
                if (isToastOpen) {
                    navigate(ROUTES.HOME)
                }
                else {
                    isToastOpen = false;
                }
                console.log(isToastOpen, '---last')

            },
        });
    }

    const handleSearch = async () => {
        setLoading(true)
        if (!search) {
            toast.warning('Please enter something to search user!', {
                position: "top-left",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                // onClose: (props) => {
                //     if (isToastOpen) isToastOpen = false;
                //     else {
                //         navigate(ROUTES.HOME)
                //     }
                // },
            });
        }
        else {
            setTimeout(async () => {
                let data = await dispatch(getSearchUsers(search))
                setSearchResult(data)
                setLoading(false)

            }, 1000)

        }
    }

    const accessChat = async (user) => {
        setLoading(true);
        try {
            let data = await dispatch(createChat({ userId: user?._id }, setLoading, setSelectedChat))
            if (!fetchedChats.find((x) => x._id === data._id)) dispatch({ type: FETCH_CHATS, payload: [data, ...fetchedChats] })

            setSelectedChat(data)
            setLoading(false)
        } catch (error) {
            console.log('err in create chat', error)
            setLoading(false)
        }
        setOpenDrawer(false)
    }

    return (
        <div>
            <ToastContainer />

            {/* header */}
            <div className='w-full h-fit bg-sky-50 p-2'>
                <div className=' bg-white w-full border border-slate-300 rounded-md md:py-2 py-1 px-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm flex justify-between'>
                    {/* open drawer */}
                    <div onClick={() => setOpenDrawer(!openDrawer)} className='w-fit items-center flex gap-2'>
                        <i className="fas fa-search text-lg"></i>
                        <p className='text-gray-500 md:block hidden'>Search User</p>
                    </div>
                    <p className='text-center items-center my-auto md:text-lg tetx-sm'>Talk-A-Tive</p>
                    <div className='flex justify-center items-center md:gap-2 gap-1'>
                        {/* Notifications */}
                        <div className="relative group z-10" onClick={() => {
                            setShowNotifications(!showNotifications)

                        }}>
                            <i className="fa-solid fa-bell md:text-2xl text-lg cursor-pointer hover:cursor-pointer"></i>
                            {notification?.length !== 0 && <div className='absolute md:w-5 md:h-5 w-4 h-4 bg-red-500 rounded-full md:-top-2 -top-1 md:left-2 left-1 justify-center items-center flex text-white p-1 md:text-sm text-xs hover:cursor-pointer'>
                                {notification?.length}
                            </div>}
                            <div className={`${showNotifications ? 'block' : 'hidden'} bg-white border md:px-3 px-2 md:py-2 py-1 absolute top-full mt-2 right-0 shadow-md w-fit rounded`}>
                                {
                                    notification?.length > 0 ?
                                        <>
                                            {
                                                notification.map((notify, index) => {
                                                    return <div className='cursor-pointer w-full py-2' key={index} onClick={() => {
                                                        setSelectedChat(notify?.chatId)
                                                        setNotification(notification.filter((n) => n?._id !== notify?._id))
                                                        dispatch(removeNotification(notify?._id))
                                                    }}>
                                                        <p className='whitespace-nowrap text-xs md:text-sm'>
                                                            {notify?.chatId?.isGroupChat ? `new messgases in ${notify?.chatId?.chatName}` : `New Messages from ${getSender(user, notify?.chatId?.users)}`}
                                                        </p>
                                                    </div>
                                                })
                                            }
                                        </> :
                                        <p className='w-full text-black text-sm whitespace-nowrap'>
                                            No New Messages
                                        </p>
                                }
                            </div>
                        </div>

                        {/* profile dropdown */}
                        <div className="relative inline-block">
                            <div
                                onClick={() => { setIsOpen(!isOpen); setShowNotifications(false) }}
                                className="text-gray-800 hover:bg-gray-200 py-1 px-2 rounded-md focus:outline-none flex items-center md:gap-2 gap-1 cursor-pointer"
                            >
                                <img
                                    src={user?.pic ? user?.pic : './user.png'}
                                    alt="User Avatar"
                                    className="md:w-8 md:h-8 w-7 h-7 rounded-full overflow-hidden object-cover"
                                />
                            </div>

                            {/* profile modal  */}
                            {isOpen && (
                                <ul className='z-10 w-48 px-3 py-1 absolute right-[-13px] mt-3 bg-white border border-gray-300 rounded-md shadow-md whitespace-nowrap text-left '>
                                    <li className="py-2 hover:bg-gray-100 cursor-pointer" onClick={() => setIsModalOpen(true)}>My Profile</li>
                                    <li className="py-2 hover:bg-gray-100 cursor-pointer" onClick={() => handleLogOut()}>Logout</li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
                <ProfileModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} profile={user} />
            </div>

            {/* drawer */}
            <div className={`fixed z-10 inset-y-0 left-0 w-72 bg-white shadow overflow-y-auto transform transition-transform duration-300 ease-in-out ${openDrawer ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex flex-col gap-3">
                    <div className='flex justify-between items-center'>
                        <p className="text-gray-800 MT-4">Search Users</p>
                        <i className="fa-solid fa-xmark text-lg cursor-pointer" onClick={() => setOpenDrawer(false)}></i>
                    </div>
                    <div className='flex justify-between gap-1 rounded'>
                        <input value={search} onChange={(e) => setSearch(e.target.value)} type="text" className='flex-grow border rounded-md p-2 focus:outline-sky-500 text-gray-600 text-sm placeholder:text-gray-300' placeholder='Enter name or email ...' />
                        <button className='border-gray-500 bg-sky-300 px-3 py-1 rounded text-white' onClick={() => handleSearch()}>Go</button>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        {loading ? <SkeletonLoader /> :
                            <div className='w-full flex flex-col gap-2'>
                                {searchResult?.map((user) => {
                                    return <React.Fragment key={user?._id}>
                                        <UserItemList user={user} handleFunction={() => accessChat(user)} />
                                    </React.Fragment>
                                })}
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SideDrawer
