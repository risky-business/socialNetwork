import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            error: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            },
            () => {
                console.log(this.state);
            }
        );
    }
    handleSubmit(e) {
        e.preventDefault();
        console.log("running handleSubmit", this.state);

        axios.post("/Login", this.state).then(resp => {
            if (resp.data.error) {
                this.setState({
                    error: resp.data.error
                });
            } else {
                location.replace("/");
            }
        });
    }
    render() {
        return (
            <div>
                <h1 className="login-title">Login</h1>

                {this.state.error ? <div>ERROR: {this.state.error}</div> : null}
                <form onSubmit={this.handleSubmit}>
                    <div className="login-input">
                        <input
                            onChange={this.handleChange}
                            name="email"
                            placeholder="email"
                            type="text"
                        />
                        <input
                            onChange={this.handleChange}
                            name="password"
                            placeholder="password"
                            type="text"
                        />
                        <button type="submit">Submit</button>
                    </div>
                </form>

                <div>
                    <h3 className="login-title">Not a member?</h3>

                    <h3 className="login-title">
                        <Link to="/">Sign up</Link>
                    </h3>
                </div>
            </div>
        );
    }
}
export default Login;
