export default function(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes
        };
    }
    if (action.type == "ACCEPT_FRIENDS_REQUEST") {
        console.log("action", action);
        console.log("state", state);
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(user => {
                if (user.id != action.id) {
                    return user;
                } else {
                    return {
                        ...user,
                        status: 2
                    };
                }
            })
        };
    }
    if (action.type == "END_FRIENDSHIP") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        status: null
                    };
                } else {
                    return user;
                }
            })
        };
    }
    if (action.type == "PUSH_ONLINE_USERS_TO_REDUX") {
        console.log("pushOnlineUsersToRedux", action.onlineUsers);
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }
    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            onlineUsers: [...state.onlineUsers, action.user]
        };
    }
    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.filter(
                user => user.id != action.user.id
            )
        };
    }
    if (action.type == "PUSH_CHAT_MESSAGES_TO_REDUX") {
        console.log("pushChatMessagesToRedux", action.chatMessages);
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    }
    if (action.type == "NEW_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.chatMessage]
        };
    }

    return state;
}
