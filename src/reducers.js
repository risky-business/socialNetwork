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

    return state;
}
