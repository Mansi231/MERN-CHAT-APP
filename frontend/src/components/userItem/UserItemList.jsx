import React from 'react'

const UserItemList = ({  user,handleFunction }) => {
    return (
        <div className='w-full rounded bg-slate-200 p-3 flex gap-2 items-center justify-center text-slate-900 hover:bg-cyan-600 hover:text-white cursor-pointer' onClick={handleFunction}>
            <img src={user?.pic ? user?.pic : './user.png'} alt="image" className='w-11 h-11 rounded-full object-cover' />
            <div className='flex flex-grow flex-col justify-start items-center'>
                <p className=' text-left w-full m-0'>{user?.name}</p>
                <p className='text-slate-400 text-sm text-left w-full m-0'>{user?.email}</p>
            </div>
        </div>
    )
}

export default UserItemList 
