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
