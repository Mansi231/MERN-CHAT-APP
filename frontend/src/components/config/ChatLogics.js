

export const getSender = (loggedInUser,users) => users[0]?._id == loggedInUser?._id ? users[1]?.name : users[0]?.name

export const getSenderProfile = (loggedInUser,users) =>  users[0]?._id == loggedInUser?._id ? users[1] : users[0]

export const isSameSender = (messages,m,i,userId) =>{
    return (
        i < messages?.length -1 && (messages[i+1]?.sender?._id !== m?.sender?._id  || messages[i+1]?.sender?._id !== undefined) && messages[i+1]?.sender?._id !== userId
    )
}

//@prev same sender , next is not same sender , not a loggedIn user messsage
export const isPrevSame = (messages,m,i,userId) =>{
    return (
        i < messages?.length -1 && (messages[i+1]?.sender?._id !== m?.sender?._id) && messages[i+1]?.sender?._id !== userId && (messages[i-1]?.sender?._id === m?.sender?._id )
    )
}

//@prev is not same , next is not same , not loggedIn user
export const isNextSame = (messages,m,i,userId) =>{
    return (
        i < messages?.length -1 && (messages[i+1]?.sender?._id !== m?.sender?._id ) && messages[i+1]?.sender?._id !== userId && (messages[i-1]?.sender?._id !== m?.sender?._id )
    )
}

export const isLastMessage = (messages,i,userId) =>{

    return (
        !(i === messages?.length-1 && (messages[messages?.length -1]?.sender?._id !== userId) && (messages[messages?.length-1]?.sender?._id))
    )
}


