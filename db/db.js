const spicedPG = require("spiced-pg");
let db;
if (process.env.DATABASE_URL) {
    db = spicedPG(process.env.DATABASE_URL);
} else {
    db = spicedPG("postgres:Mario:password@localhost:5432/socialnetwork");
}

exports.saveNewUser = function(firstname, lastname, email, password) {
    const q = `
        INSERT INTO users (first_name, last_name, email, hashed_password)
        VALUES ($1, $2, $3, $4)
        RETURNING *`;
    const params = [firstname, lastname, email, password];
    return db.query(q, params).then(results => {
        return results.rows[0].id;
    });
};
exports.getPasswordDB = function(email) {
    const params = [email];
    return db
        .query("SELECT hashed_password FROM users WHERE email = $1;", params)
        .then(results => {
            return results.rows[0];
        });
};

exports.getEmails = function(email) {
    const params = [email];
    return db
        .query("SELECT * FROM users WHERE email = $1;", params)
        .then(results => {
            return results.rows[0];
        });
};

exports.changeUserPic = function(user_id, image_url) {
    const params = [user_id, image_url];
    const q = `
        UPDATE users SET
        image_url = $2
        WHERE id = $1
        RETURNING *;
        `;
    return db.query(q, params).then(userInfo => {
        return userInfo.rows[0].image_url;
    });
};

exports.getUserById = function(id) {
    console.log("logging id being passed to db getUserById: ", id);
    const params = [id];
    return db
        .query("SELECT * FROM users WHERE id = $1;", params)
        .then(results => {
            console.log(
                "logging results.rows[0] on db getUserById: ",
                results.rows[0]
            );
            return results.rows[0];
        });
};
exports.saveBio = function(id, bio) {
    const params = [id, bio];
    const q = `
        UPDATE users SET
        bio = $2
        WHERE id = $1
        RETURNING *;
        `;
    return db.query(q, params).then(userInfo => {
        return userInfo.rows[0].bio;
    });
};
