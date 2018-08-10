import React, { Component } from "react";
import axios from "./axios";

class FriendButton extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.sendRequest = this.sendRequest.bind(this);
        this.updateButton = this.updateButton.bind(this);
        this.inviteFriend = this.inviteFriend.bind(this);
        this.terminateFriend = this.terminateFriend.bind(this);
        this.acceptFriend = this.acceptFriend.bind(this);
    }
    componentDidMount() {
        this.updateButton();
    }
    updateButton() {
        axios.get("/friend/" + this.props.id + ".json").then(({ data }) => {
            if (!data || !data.status) {
                this.setState({
                    buttonText: "Send friend request",
                    status: null
                });
            } else {
                console.log("there is data! ", data);
                this.setState({
                    sessionUserId: data.sessionUserId,
                    receiverId: data.receiverId,
                    senderId: data.senderId
                });
                if (data.status == 1) {
                    if (this.state.sessionUserId == this.state.senderId) {
                        console.log("if im the sender (Cancel Invitation)");
                        this.setState({
                            buttonText: "Cancel Invitation",
                            status: 1
                        });
                    } else if (
                        this.state.sessionUserId == this.state.receiverId
                    ) {
                        console.log("if im the receiver (Accept Invitation)");
                        this.setState({
                            buttonText: "Accept Invitation",
                            status: 1
                        });
                    }
                } else if (data.status == 2) {
                    this.setState({
                        buttonText: "Stop friendship",
                        status: 2
                    });
                }
            }
        });
    }
    sendRequest() {
        if (!this.state.status || this.state.status == null) {
            this.inviteFriend();
        } else if (this.state.status == 1) {
            if (this.state.sessionUserId == this.state.senderId) {
                this.terminateFriend();
            } else if (this.state.sessionUserId == this.state.receiverId) {
                this.acceptFriend();
            }
        } else if (this.state.status == 2) {
            this.terminateFriend();
        }
    }
    inviteFriend() {
        console.log("invite happening");
        axios.post("/friend/" + this.props.id + ".json").then(({ data }) => {
            this.setState({
                status: 1,
                sessionUserId: data.sessionUserId,
                receiverId: data.receiverId,
                senderId: data.senderId,
                buttonText: "Cancel Invitation"
            });
            console.log("after invite return of data");
            console.log("this.state.sessionUserId: ", this.state.sessionUserId);
            console.log("this.state.senderId: ", this.state.senderId);
            if (this.state.sessionUserId == this.state.senderId) {
                console.log("if im the sender (Cancel Invitation)");
                this.setState({
                    buttonText: "Cancel Invitation"
                });
            } else if (this.state.sessionUserId == this.state.receiverId) {
                console.log("if im the receiver (Accept Invitation)");
                this.setState({
                    buttonText: "Accept Invitation"
                });
            }
        });
    }
    terminateFriend() {
        console.log("terminate happening");
        this.setState({
            buttonText: "Send friend request",
            status: null
        });
        axios.post("/terminate/" + this.props.id + ".json").then(({ data }) => {
            console.log("inside returned data of terminate");
            this.setState({
                sessionUserId: data.sessionUserId,
                receiverId: data.receiverId,
                senderId: data.senderId
            });
        });
    }
    acceptFriend() {
        console.log("accept happening");
        this.setState({
            buttonText: "Stop friendship",
            status: 2
        });
        axios.post("/accept/" + this.props.id + ".json").then(({ data }) => {
            console.log("Axios post of accept friend in button");
            this.setState({
                sessionUserId: data.sessionUserId,
                receiverId: data.receiverId,
                senderId: data.senderId
            });
        });
    }
    render() {
        var friendButtonStyle = {
            textAlign: "center"
        };
        var button = {
            width: "auto",
            height: "auto",
            margin: 0
        };
        const { buttonText } = this.state;
        if (!this.props.id) {
            return null;
        }
        return (
            <div id="FriendButton" style={friendButtonStyle}>
                <button style={button} onClick={this.sendRequest}>
                    {buttonText}
                </button>
            </div>
        );
    }
}

export default FriendButton;
