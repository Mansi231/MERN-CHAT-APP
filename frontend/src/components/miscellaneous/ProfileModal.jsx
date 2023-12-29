import React, { memo } from 'react'

const ProfileModal = ({ isOpen, onClose ,profile }) => {
    
    const modalStyles = isOpen
        ? 'fixed inset-0 flex items-center justify-center'
        : 'hidden';

    return (
        <div className={`z-50 modal ${modalStyles}`}>
            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

            <div className="modal-content bg-white p-10 rounded shadow-lg z-50 w-96 text-center items-center relative">
                <i className="fa-solid fa-xmark absolute right-2 top-1 text-lg cursor-pointer" onClick={onClose}></i>
                <p className='font-sans text-2xl tracking-wide'>{profile?.name}</p>
                <img src={profile?.pic ? profile?.pic : './user.png'} alt="image" className='w-36 h-36 rounded-full overflow-hidden mx-auto my-4 object-cover' />
                <p className='text-gray-500'>Email : {profile?.email}</p>
            </div>
        </div>
    )
}

export default memo(ProfileModal)
