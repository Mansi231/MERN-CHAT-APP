import React from 'react'

const   UserBadgeItem = ({user,handleFunction}) => {
  return (
    <div className='flex gap-3 justify-between items-center py-1 px-2 rounded-full bg-sky-700 w-fit cursor-pointer' onClick={handleFunction}>
      <p className='text-sm text-white'>{user?.name}</p> 
      <p className='text-sm text-white'>x</p> 
    </div>
  )
}

export default UserBadgeItem
