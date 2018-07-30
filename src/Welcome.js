import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./Registration";
import Nav from "./Nav";

import Login from "./Login";

function Welcome() {
    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <a href="/welcome">
                            <img className="logo" src="/logo.png" />
                        </a>
                    </li>
                </ul>
            </nav>

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
