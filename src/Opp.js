import React, { Component } from "react";
import axios from "./axios";
import FriendButton from "./FriendButton";

class Opp extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }
    componentDidMount() {
        axios
            .get("/user/" + this.props.match.params.id + ".json")
            .then(({ data }) => {
                if (data.redirect) {
                    this.props.history.push("/");
                } else {
                    this.setState(data);
                }
            });
    }
    render() {
        const { first_name, last_name, id, image, bio } = this.state;
        if (!id) {
            return null;
        }
        return (
            <div id="opp">
                <img id="profile-pic" src={image} alt="" />
                <h3>{`${first_name} ${last_name}`} Profile</h3>
                <p>{bio}</p>
                <FriendButton id={id} />
            </div>
        );
    }
}

export default Opp;
