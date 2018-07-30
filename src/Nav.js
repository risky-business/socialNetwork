import React, { Component } from "react";

function Nav(props) {
    return (
        <nav>
            <ul>
                <li>
                    <a href="/welcome">
                        <img className="logo" src="/logo.png" />
                    </a>
                </li>
                <li className="item">
                    <a href="/">Profile</a>
                </li>
                <li className="item">
                    <a href="/logout">Logout</a>
                </li>
                <li className="item">
                    <img className="logo" src={props.image} />
                </li>
            </ul>
        </nav>
    );
}

export default Nav;
