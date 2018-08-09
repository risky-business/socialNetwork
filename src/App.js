import React, { Component } from "react";
import axios from "./axios";
import Opp from "./opp";
import Uploader from "./Uploader";
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./Profile";
import Friends from "./friends";
import Nav from "./Nav";
import Chat from "./chat";
import OnlineUsers from "./OnlineUsers";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showBio: false
        };
        this.hideUploader = this.hideUploader.bind(this);
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.toggleShowBio = this.toggleShowBio.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    handlePropagation(e) {
        e.stopPropagation();
    }
    showUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible
        });
    }

    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }
    toggleShowBio() {
        this.setState({
            showBio: !this.state.showBio
        });
    }
    setBio(value) {
        axios.post("/bio", { bio: value }).then(({ data }) => {
            console.log("bio DATA: ", data.bio);
            this.setState({ bio: data.bio });
        });
    }

    setImage(url) {
        console.log("url in setImage: ", url);
        this.setState({
            uploaderIsVisible: false,
            image: url
        });
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            console.log("LOGGING DATA: ", data);
            this.setState(data);
        });
    }

    render() {
        const { first_name, last_name, id, image, bio, showBio } = this.state;
        if (!this.state.id) {
            return null;
        }
        return (
            <div id="app">
                <Nav image={this.state.image} />

                {/*<Logo />*/}
                {this.state.uploaderIsVisible && (
                    <div onClick={this.showUploader} id="modal">
                        <div
                            onClick={this.handlePropagation}
                            className="modal-box"
                        >
                            <i
                                onClick={this.showUploader}
                                id="close-button"
                                className="fas fa-times-circle"
                            />
                            <Uploader
                                setImage={this.setImage}
                                hideUploader={this.hideUploader}
                            />
                        </div>
                    </div>
                )}
                <BrowserRouter>
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    image={image}
                                    firstName={first_name}
                                    lastName={last_name}
                                    id={id}
                                    bio={bio}
                                    showBio={showBio}
                                    toggleShowBio={this.toggleShowBio}
                                    setBio={this.setBio}
                                    showUploader={this.showUploader}
                                    hideUploader={this.hideUploader}
                                />
                            )}
                        />
                        <Route exact path="/user/:id" component={Opp} />
                        <Route path="/friends-list" component={Friends} />
                        <Route path="/online" component={OnlineUsers} />
                        <Route path="/chat" component={Chat} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
