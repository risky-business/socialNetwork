import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./Welcome";
import Logo from "./Logo";
import axios from "./axios";

ReactDOM.render(
    location.pathname == "/welcome" ? <Welcome /> : <Logo />,
    document.querySelector("main")
);
