const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const bcrypt = require("./db/bcrypt");
const db = require("./db/db.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const s3 = require("./s3");
const config = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});
app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use(compression());

app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
///
function checkForLog(req, res, next) {
    if (!req.session.user) {
        res.redirect("/welcome");
    } else {
        next();
    }
}

app.post("/registration", (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    if (firstname == "" || lastname == "" || email == "" || password == "") {
        res.json({
            error: "Please fill all the fields bellow"
        });
    } else {
        bcrypt.hashPassword(password).then(hashedPassword => {
            db.saveNewUser(firstname, lastname, email, hashedPassword)
                .then(id => {
                    console.log("NEW USER SAVED!");
                    req.session.userId = id;

                    req.session.user = {
                        id: id,
                        firstname: lastname,
                        email: email,
                        hashedPassword: hashedPassword
                    };
                    res.json({
                        success: true
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        error: "duplicate email"
                    });
                });
        });
    }
});

app.post("/login", (req, res) => {
    db.getEmails(req.body.email).then(userInfo => {
        if (userInfo && userInfo.email) {
            bcrypt
                .checkPassword(req.body.password, userInfo.hashed_password)
                .then(passwordsMatch => {
                    if (passwordsMatch) {
                        req.session.userId = userInfo.id;
                        req.session.user = {
                            id: userInfo.id,
                            firstName: userInfo.first_name,
                            lastName: userInfo.last_name,
                            email: userInfo.email,
                            hashedPassword: userInfo.hashed_password
                        };
                        res.json({
                            success: true,
                            id: userInfo.id,
                            first_name: userInfo.first_name,
                            last_name: userInfo.last_name,
                            email: userInfo.email,
                            hashedPassword: userInfo.hashed_password
                        });
                    } else {
                        res.json({
                            success: false,
                            error: "Enter Correct password"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.json({
                        success: false,
                        error: "Wrong"
                    });
                });
        } else {
            res.json({
                success: false,
                error: "Email not found"
            });
        }
    });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("we are here, and the file is: ", req.file.filename);
    db.changeUserPic(
        req.session.user.id,
        config.s3Url + req.file.filename
    ).then(imgUrl => {
        res.json({
            success: true,
            url: imgUrl
        });
    });
});

app.get("/user", (req, res) => {
    db.getUserById(req.session.user.id)
        .then(data => {
            res.json({
                ...data,
                image: data.image_url || "/default_profile_picture.png"
            });
        })
        .catch(err => {
            console.log("logging error", err);
            res.sendStatus(500);
        });
});

app.get("/user/:id.json", (req, res) => {
    if (req.session.user.id == req.params.id) {
        res.json({
            redirect: true
        });
    } else {
        db.getUserById(req.params.id).then(data => {
            res.json({
                ...data,
                image: data.image_url || "/content/default_profile_picture.png"
            });
        });
    }
});

app.get("/friend/:id.json", (req, res) => {
    db.getCurrentStatus(req.session.user.id, req.params.id)
        .then(data => {
            console.log(
                "req.session.user.id: ",
                req.session.user.id,
                " req.params.id: ",
                req.params.id
            );
            console.log("current status (during get server): ", data);
            res.json(
                data && {
                    sessionUserId: req.session.user.id,
                    status: data.status,
                    senderId: data.sender_id,
                    receiverId: data.receiver_id
                }
            );
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.user.id,
                status: false
            });
        });
});

app.post("/friend/:id.json", (req, res) => {
    db.setStatus(req.session.user.id, req.params.id)
        .then(curStatus => {
            console.log("current status (evfd): ", curStatus);
            res.json({
                sessionUserId: req.session.user.id,
                status: 2
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.user.id,
                status: false
            });
        });
});
app.post("/endfriendship/:id.json", function(req, res) {
    db.deleteFriend(req.params.id, req.session.userId).then(friendInfo => {
        console.log("friendInfo in friendship route", friendInfo);

        res.json(friendInfo);
    });
});

app.post("/terminate/:id.json", (req, res) => {
    console.log("beggining of delete post in server");
    db.deleteFriend(req.session.user.id, req.params.id)
        .then(curStatus => {
            console.log("Status deleted (friendship terminated): ", curStatus);
            res.json({
                sessionUserId: req.session.user.id,
                status: false
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.user.id,
                status: false
            });
        });
});

app.post("/accept/:id.json", (req, res) => {
    console.log("beggining of accept post in server");
    db.acceptFriend(req.session.user.id, req.params.id)
        .then(curStatus => {
            console.log("Status accepted (friendship accepted): ", curStatus);
            res.json({
                sessionUserId: req.session.user.id,
                status: 2
            });
        })
        .catch(err => {
            console.log(err);
            res.json({
                sessionUserId: req.session.user.id,
                status: 2
            });
        });
});
app.get("/friends.getwannabes", function(req, res) {
    console.log("mario has a  .....V", req.session.userId);
    db.getFriendsAndWannabes(req.session.userId)
        .then(data => {
            console.log("get your friends ", data);
            res.json({ data });
        })
        .catch(error => {
            console.log("error in get your friends", error);
        });
});

app.post("/bio", (req, res) => {
    console.log("req.body.bio: ", req.body.bio);
    db.saveBio(req.session.user.id, req.body.bio).then(bio => {
        console.log("bio on the server: ", bio);
        res.json({ bio });
    });
});

app.get("/welcome", (req, res) => {
    if (req.session.user) {
        console.log("no user ID found, redirecting to ...");
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", checkForLog, function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

let onlineUsers = {};
let chatMessages = [];

io.on("connection", function(socket) {
    onlineUsers[socket.id] = socket.request.session.user.id;
    console.log("online useeers", onlineUsers);
    db.getUsersInfosByIds(Object.values(onlineUsers)).then(users => {
        console.log("online users are : ", users);
        socket.emit("onlineUsers", users);
    });

    socket.emit("chatMessages", chatMessages.slice(-10));

    if (
        Object.values(onlineUsers).filter(
            id => id == socket.request.session.user.id
        ).length == 1
    ) {
        db.getUserById(socket.request.session.user.id)
            .then(results => {
                socket.broadcast.emit("userJoined", results);
            })
            .catch(error => {
                console.log(error);
            });
    }

    socket.on("disconnect", function() {
        if (
            Object.values(onlineUsers).filter(
                id => id == socket.request.session.user.id
            ).length == 1
        ) {
            db.getUserById(socket.request.session.user.id)
                .then(results => {
                    socket.broadcast.emit("userLeft", results);
                })
                .catch(error => {
                    console.log(error);
                });
        }
        delete onlineUsers[socket.id];
    });

    socket.on("newMessage", function(newMessage) {
        db.getUserById(socket.request.session.user.id)
            .then(data => {
                let completNewMessage = {
                    firstName: data.first_name,
                    lastName: data.last_name,
                    profilePic: data.image_url,
                    userId: socket.request.session.user.id,
                    content: newMessage,
                    date: new Date()
                };

                chatMessages = [...chatMessages, completNewMessage];
                io.sockets.emit("newMessageBack", completNewMessage);
            })
            .catch(error => {
                console.log(error);
            });
    });
});

server.listen(8080, function() {
    console.log("I'm listening.");
});
