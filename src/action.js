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
