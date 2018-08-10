import React, { Component } from "react";
// import { Link } from 'react-router-dom';
import { connect } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendsRequest,
    endFriendship
} from "./action";
{
    /*import FriendButton from "./friendButton";*/
}

class Friends extends Component {
    componentDidMount() {
        this.props.dispatch(receiveFriendsWannabes());
    }
    acceptFriendsButton(id) {
        this.props.dispatch(acceptFriendsRequest(id));
    }
    endFriendshipButton(id) {
        this.props.dispatch(endFriendship(id));
    }

    render() {
        console.log(this.props.friend);
        var { friend, pending } = this.props;
        if (!friend || !pending) {
            return null;
        }
        var listOfFriends = (
            <div>
                <h1 className="online-title">Friends</h1>
                <div className="online-users">
                    {friend.map(user => (
                        <div key={user.id}>
                            <img
                                className="online-user-pic"
                                src={user.image_url || "/images/default.png"}
                                onClick={() =>
                                    (location.href = "/user/" + user.id)
                                }
                            />
                            <p className="name-title">
                                {user.first_name} {user.last_name}
                            </p>
                            <div id="button-friends">
                                <button
                                    onClick={e =>
                                        this.endFriendshipButton(user.id, e)
                                    }
                                >
                                    End Friendship
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );

        var listOfPendingFriends = (
            <div>
                <h1>Pending friends request</h1>
                {pending.map(user => {
                    return (
                        <div key={user.id}>
                            <img
                                className="online-user-pic"
                                src={user.image_url || "/images/default.png"}
                                onClick={() =>
                                    (location.href = "/user/" + user.id)
                                }
                            />
                            <p className="name-title">
                                {user.first_name} {user.last_name}
                            </p>
                            <div id="button-friends">
                                <button
                                    onClick={e =>
                                        this.acceptFriendsButton(user.id, e)
                                    }
                                >
                                    Accept
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );

        return (
            <div>
                <div>
                    {!friend.length && <div>No friend request</div>}
                    {!!friend.length && (
                            <h3>
                                These People would like to be friends, yes or
                                no?
                            </h3>
                        ) &&
                        listOfFriends}
                </div>
                <div id="button-friends">
                    {!pending.length && <div>pendings request... none :(</div>}
                    {!!pending.length && (
                            <h3>
                                These People would like to be friends, yes or
                                no?
                            </h3>
                        ) &&
                        listOfPendingFriends}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps", state.friendsWannabes);

    return {
        pending:
            state.friendsWannabes &&
            state.friendsWannabes.filter(user => user.status == 1),
        friend:
            state.friendsWannabes &&
            state.friendsWannabes.filter(user => user.status == 2)
    };
};

export default connect(mapStateToProps)(Friends);
