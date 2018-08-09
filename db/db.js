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
exports.getCurrentStatus = function(sender_id, receiver_id) {
    const params = [sender_id, receiver_id];
    const q = `
        SELECT * FROM friendships
        WHERE ((sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1))
        `;
    return db
        .query(q, params)
        .then(results => {
            console.log("results.rows[0] during get: ", results.rows[0]);
            return results.rows[0];
        })
        .catch(err => {
            return err;
        });
};

exports.setStatus = function(sender_id, receiver_id) {
    const params = [sender_id, receiver_id];
    const q = `
        INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)
        RETURNING *;
        `;
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in post: ", results.rows[0]);
        return results.rows[0];
    });
};

exports.deleteFriend = function(sender_id, receiver_id) {
    console.log("delete happening in db");
    const params = [sender_id, receiver_id];
    const q = `
        DELETE FROM friendships
        WHERE ((sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1));
        `;
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in delete db: ", results.rows[0]);
        return results.rows[0];
    });
};

exports.acceptFriend = function(sender_id, receiver_id) {
    console.log("accept happening in db");
    const params = [sender_id, receiver_id];
    const q = `
        UPDATE friendships
        SET status = 2
        WHERE ((sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1));
        `;
    return db.query(q, params).then(results => {
        console.log("results.rows[0] in accept db: ", results.rows[0]);
        return results.rows[0];
    });
};

exports.getUsersByIds = function(ids) {
    const params = [ids];
    const q = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(q, params).then(results => {
        console.log("results.rows in accept db: ", results.rows);
        return results.rows;
    });
};
exports.getFriendsAndWannabes = function(userId) {
    const q = `
           SELECT users.id, users.first_name, users.last_name, users.image_url, friendships.status
           FROM friendships
           JOIN users
           ON (status = 1 AND receiver_id = $1 AND sender_id = users.id)
           OR (status = 2 AND receiver_id = $1 AND sender_id = users.id)
           OR (status = 2 AND sender_id = $1 AND receiver_id = users.id)
       `;
    const params = [userId];
    return db.query(q, params).then(results => {
        return results.rows;
    });
};
exports.getUsersInfosByIds = function(arrayOfIds) {
    const query = `SELECT * FROM users WHERE id = ANY($1)`;
    return db.query(query, [arrayOfIds]).then(results => {
        console.log(results.rows);
        return results.rows;
    });
};
