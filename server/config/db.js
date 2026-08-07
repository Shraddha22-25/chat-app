const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",
    port:  3306,
    user: "root",
    password: "MySQL@22",
    database: "chat_app"
});
db.connect((err) => {

    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("Database Connected Successfully");
    }

});

module.exports = db;