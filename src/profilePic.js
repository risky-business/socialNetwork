import React from "react";

function ProfilePic(props) {
    console.log("profile pic:", props);
    return (
        <div id="profile-pic-div">
            <img
                id="profile-pic"
                src={props.image}
                alt={`${props.first_name} ${props.last_name}`}
                onClick={props.clickHandler}
            />
        </div>
    );
}

export default ProfilePic;
