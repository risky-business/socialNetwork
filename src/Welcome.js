import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./Registration";

import Login from "./Login";

function Welcome() {
    return (
        <div>
            <img className="main-logo" src="/logo.png" />

            <HashRouter>
                <div>
                    <nav>
                        <Link to="/Login">Log in </Link>
                    </nav>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/Login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
export default Welcome;
