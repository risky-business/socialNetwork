import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./Registration";

import Login from "./Login";

function Welcome() {
    return (
        <div>
            {/*<nav>


            </nav>*/}

            <HashRouter>
                <div>
                    <nav>
                        <ul>
                            <li>
                                <a href="/welcome">
                                    <img className="logo" src="/logo.png" />
                                </a>
                            </li>
                            <li className="item">
                                <Link to="/Login">Log in </Link>
                            </li>
                        </ul>
                    </nav>
                    <Route exact path="/" component={Registration} />
                    <Route exact path="/Login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
export default Welcome;
