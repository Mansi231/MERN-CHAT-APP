import { FETCH_CHATS, FETCH_SEARCH_USERS } from "../actions/ChatAction";

const initialState = {
    search_users:[],
    fetch_chats:[]
}

const ChatReducer = function(state = initialState , action){
    switch (action.type) {
        case FETCH_SEARCH_USERS:
            return {...state,search_users:action.payload}    
        case FETCH_CHATS:
            return {...state,fetch_chats:action.payload}    
        default:
            return state
    }
}

export default ChatReducer