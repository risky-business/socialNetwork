import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

import App from "./app";
import { Provider } from "react-redux";
import reducer from "./reducers";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import { init } from "./socket";
{
    /*import { init } from "./socket";
*/
}
// ReactDOM.render(<Welcome />, document.querySelector("main"));
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
if (location.pathname != "/welcome") {
    init(store);
}

ReactDOM.render(
    location.pathname == "/welcome" ? (
        <Welcome />
    ) : (
        <Provider store={store}>
            <App />
        </Provider>
    ),

    document.querySelector("main")
);
