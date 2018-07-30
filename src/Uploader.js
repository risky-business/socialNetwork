import React, { Component } from "react";
import axios from "./axios";

class Uploader extends Component {
    constructor(props) {
        super(props);

        this.imageSelected = this.imageSelected.bind(this);
        this.upload = this.upload.bind(this);
    }
    imageSelected(e) {
        this.setState({
            imageFile: e.target.files[0]
        });
    }
    upload() {
        var formData = new FormData();
        console.log("imageFile: ", this.state.imageFile);
        if (this.state.imageFile == "") {
            this.setState({
                error: "Please select a file in order to upload"
            });
        } else {
            formData.append("file", this.state.imageFile);
            axios.post("/upload", formData).then(res => {
                console.log("axios post /upload : ", res.data.url);
                if (res.data.success) {
                    this.props.setImage(res.data.url);
                }
            });
        }
    }
    render() {
        return (
            <div id="uploader">
                <h3>Change your image</h3>
                <label id="file-label" htmlFor="file-field">
                    Select image
                </label>
                <input
                    id="file-field"
                    type="file"
                    onChange={this.imageSelected}
                    name=""
                    value=""
                />
                <div className="content-box">
                    <button
                        id="upload-button"
                        onClick={this.upload}
                        name="button"
                    >
                        Upload
                    </button>
                </div>
            </div>
        );
    }
}

export default Uploader;
