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
            } else if (data.status == 1) {
                if (data.sessionUserId == data.receiverId) {
                    this.setState({
                        buttonText: "Accept Invitation",
                        status: 1
                    });
                } else {
                    this.setState({
                        buttonText: "Cancel Invitation",
                        status: 1
                    });
                }
            } else if (data.status == 2) {
                this.setState({
                    buttonText: "End friendship",
                    status: 2
                });
            }
        });
    }
    sendRequest() {
        console.log("current status is: ", this.state.status);
        if (!this.state.status) {
            this.inviteFriend();
        } else if (this.state.status == 1) {
            this.acceptFriend();
        } else if (this.state.status == 2) {
            this.terminateFriend();
        }
        this.updateButton();
    }
    inviteFriend() {
        console.log("invite happening");
        axios.post("/friend/" + this.props.id + ".json").then(({ data }) => {
            this.setState({
                buttonText: "Cancel Invitation",
                status: 1
            });
        });
    }
    terminateFriend() {
        axios.post("/terminate/" + this.props.id + ".json").then(({ data }) => {
            this.setState({
                buttonText: "Send friend request",
                status: false
            });
        });
    }
    acceptFriend() {
        axios.post("/accept/" + this.props.id + ".json").then(({ data }) => {
            console.log("Axios post of accept friend in button");
            this.setState({
                buttonText: "End friendship",
                status: 2
            });
        });
    }
    render() {
        const { buttonText } = this.state;
        return (
            <div id="FriendButton">
                <button onClick={this.sendRequest}>{buttonText}</button>
            </div>
        );
    }
}

export default FriendButton;
