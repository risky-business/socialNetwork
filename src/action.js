import axios from "./axios";

export async function receiveFriendsWannabes() {
    const { data } = await axios.get("/friends" + ".getwannabes");
    {
        console.log("jarrod has a small (o)", data);
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            friendsWannabes: data.data
        };
    }
}
export function acceptFriendsRequest(id) {
    return axios.post("/accept/" + id + ".json").then(data => {
        console.log(data);
        return {
            type: "ACCEPT_FRIENDS_REQUEST",
            id
        };
    });
}
export function endFriendship(id) {
    return axios.post("/endfriendship/" + id + ".json").then(data => {
        console.log(data);
        return {
            type: "END_FRIENDSHIP",
            id
        };
    });
}
export function pushOnlineUsersToRedux(onlineUsers) {
    return {
        type: "PUSH_ONLINE_USERS_TO_REDUX",
        onlineUsers
    };
}
export function userJoined(user) {
    console.log("userjoined", user);
    return {
        type: "USER_JOINED",
        user
    };
}
export function userLeft(user) {
    console.log("userLeft", user);
    return {
        type: "USER_LEFT",
        user
    };
}
export function pushChatMessagesToRedux(chatMessages) {
    return {
        type: "PUSH_CHAT_MESSAGES_TO_REDUX",
        chatMessages
    };
}
export function newMessageAction(chatMessage) {
    console.log("newMessage", chatMessage);
    return {
        type: "NEW_MESSAGE",
        chatMessage
    };
}
