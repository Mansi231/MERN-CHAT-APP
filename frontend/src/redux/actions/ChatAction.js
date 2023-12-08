import { client } from "../../services/client";

// actionTypes.js
export const FETCH_SEARCH_USERS = 'FETCH_SEARCH_USERS';
export const FETCH_CHATS = 'FETCH_CHATS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

// ***************************************************** Authenticaiton ***************************************************** 

export const apiLogin = (fields, toast, setLoading) => (dispatch) => {
    client.post('/user/login', fields).then((result) => {
        toast()
        setLoading(false)
        localStorage.setItem('userInfo', JSON.stringify(result.data))
    }).catch((err) => {
        console.log(err)
        return err
    })

}

export const apiRegister = (fields, toast, setLoading) => (dispatch) => {
    client.post('/user', fields).then((result) => {
        toast()
        setLoading(false)
        localStorage.setItem('userInfo', JSON.stringify(result.data))
    }).catch((err) => {
        setLoading(false)
        console.log(err)
        return err
    })
}

// ***************************************************** chat actions ***************************************************** 

// @get searched users
export const getSearchUsers = (search) => (dispatch) => {
    return client.get(`user?search=${search}`).then((result) => {
        dispatch({ type: FETCH_SEARCH_USERS, payload: result.data })
        return result.data
    }).catch((err) => {
        console.log(err, '---err in getting users---')
        return err
    })
}

// @create chat / access chat
export const createChat = (data, setLoading, setSelectedChat) => (dispatch) => {
    return client.post(`/chat`, data).then((res) => {
        return res.data
    }).catch((err) => { console.log('error while createting chat!', err); return err })
}

// @fetch chat
export const fetchChats = (setLoading) => (dispatch) => {
    client.get('/chat').then((res) => {
        dispatch({ type: FETCH_CHATS, payload: res.data })
        setLoading ? setLoading(false) : null
    }).catch((Err) => {
        console.log('Error while fetching chats :: ', Err);
        setLoading ? setLoading(false) : null
    })
}

// @create group chat
export const createGroupChat = (data, fetchedChats, setOpenGroupModal) => (dispatch) => {
    client.post(`/chat/group`, data).then((res) => {
        dispatch({ type: FETCH_CHATS, payload: [...fetchedChats, res.data] })
        setOpenGroupModal(false)
    }).catch((err) => {
        setOpenGroupModal(false)
        console.log(err, ' :: error in creating group chat ')
    })
}

// @rename group chat
export const renameGroupChat = (data, setSelectedChat) => (dispatch) => {
    client.put(`/chat/rename`, data).then((res) => {
        setSelectedChat(res.data)
        dispatch(fetchChats())
    }).catch((err) => { console.log(err, ' :: error while renaming group chat ') })
}

// @add user to group chat
export const addUserToGroup = (data, setSelectedChat) => (dispatch) => {
    client.put(`/chat/addToGroup`, data).then((res) => {
        setSelectedChat(res.data)
        dispatch(fetchChats())
    }).catch((err) => {
        console.log(err, ' :: adding user to group error !!!!!')
    })
}

// @remove user from group chat
export const removeUserFromGroup = (data, setSelectedChat) => (dispatch) => {
    client.put(`/chat/removeFromGroup`, data).then((res) => {
        setSelectedChat(res.data)
        dispatch(fetchChats())
    }).catch((err) => {
        console.log(err, ' :: adding user to group error !!!!!')
    })
}

// @send messsage for a chat
export const sendMessageToChat = (data) => (dispatch) => {
    return client.post(`/message`, data).then((res) => {
        return res.data
    }).catch((err) => {
        console.log(err, ' :: send message error !!!!!')
    })
}

// @fetch messsages for a chat
export const fetchChatMessages = (chatId) => (dispatch) => {
    return client.get(`/message/${chatId}`).then((res) => {
        return res.data
    }).catch((err) => {
        console.log(err, ' :: send message error !!!!!')
    })
}

// ***************************************************** notification actions *****************************************************

// @careate/access notification
export const createNotification = (data) => (dispatch) => {
    client.post(`/notification`, data).then((res) => {
    }).catch((err) => {
        console.log(err, '---err in creating notification')
    })
}

// @fetch loggedIn user notification
export const fetchUserNotifications = () => (dispatch) => {
    return client.get(`/notification`).then((res) => {
        return res.data
    }).catch((err) => {
        console.log(err, '----err getting notification')
    })
}

// @remove notification
export const removeNotification = (id) => (dispatch) =>{
    client.get(`/notification/${id}`).then((res)=>{}).catch((err)=>err)
}


