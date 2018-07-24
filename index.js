const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const bc = require("./db/bcrypt.js");
const bcrypt = require("./db/bcrypt");
const db = require("./db/db.js");
const cookieSession = require("cookie-session");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use(compression());

app.use(
    cookieSession({
        secret: `I'm always hangry.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

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
app.get("/welcome", (req, res) => {
    if (req.session.user) {
        console.log("no user ID found, redirecting to ...");
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", checkForLog, function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function() {
    console.log("I'm listening.");
});
