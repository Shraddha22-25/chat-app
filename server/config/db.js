require("dotenv").config();
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_HOST ? { rejectUnauthorized: false } : false
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed:", err.message);
  } else {
    console.log("Database Connected Successfully");

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) DEFAULT 'User',
        username VARCHAR(100),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(225) NOT NULL,
        image VARCHAR(255) DEFAULT NULL,
        bio TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createMessagesTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    db.query(createUsersTable, (queryErr) => {
      if (queryErr) {
        console.log("Users table error:", queryErr.message);
      } else {
        console.log(" 'users' table is ready!");
        db.query("ALTER TABLE users ADD COLUMN name VARCHAR(100) DEFAULT 'User'", () => {});
        db.query("ALTER TABLE users ADD COLUMN image VARCHAR(255) DEFAULT NULL", () => {});
        db.query("ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL", () => {});
      }
    });

    db.query(createMessagesTable, (queryErr) => {
      if (queryErr) {
        console.log("Messages table error:", queryErr.message);
      } else {
        console.log(" 'messages' table is ready!");
      }
    });
  }
});

module.exports = db;