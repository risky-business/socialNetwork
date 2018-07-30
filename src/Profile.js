import React, { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";

class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    render() {
        const {
            firstName,
            lastName,
            id,
            image,
            bio,
            showBio,
            toggleShowBio,
            setBio,
            showUploader
        } = this.props;
        console.log(firstName, lastName);

        return (
            <div id="profile">
                <ProfilePic
                    image={image}
                    first_name={firstName}
                    last_name={lastName}
                    clickHandler={showUploader}
                />
                <h1>
                    {firstName} {lastName}
                </h1>

                {bio ? (
                    <p>
                        {bio} <span onClick={toggleShowBio}> Edit</span>{" "}
                    </p>
                ) : (
                    <p onClick={toggleShowBio}>Click here to write a bio</p>
                )}

                {showBio && (
                    <textarea
                        onChange={this.handleChange}
                        name="bio"
                        id=""
                        cols="30"
                        rows="10"
                    />
                )}

                {showBio && (
                    <button onClick={() => setBio(this.state.bio)}>SAVE</button>
                )}
            </div>
        );
    }
}

export default Profile;
