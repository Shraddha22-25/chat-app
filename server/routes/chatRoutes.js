const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../config/multer");

router.post("/send", (req, res) => {
  const { sender_id, receiver_id, message } = req.body;

  if (!sender_id || !receiver_id || !message) {
    return res.status(400).json({
      success: false,
      message: "sender_id, receiver_id, and message are required"
    });
  }

  const sql = `
    INSERT INTO messages (sender_id, receiver_id, message)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [String(sender_id), String(receiver_id), message], (err, result) => {
    if (err) {
      console.log("Send Message Error:", err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.status(201).json({
      success: true,
      message: "Message Sent Successfully",
      insertId: result.insertId
    });
  });
});

router.get("/messages/:senderId/:receiverId", (req, res) => {
  const { senderId, receiverId } = req.params;

  const sql = `
    SELECT * FROM messages
    WHERE (sender_id = ? AND receiver_id = ?)
       OR (sender_id = ? AND receiver_id = ?)
    ORDER BY created_at ASC
  `;

  db.query(sql, [senderId, receiverId, receiverId, senderId], (err, result) => {
    if (err) {
      console.log("Fetch Messages Error:", err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.status(200).json({
      success: true,
      messages: result || []
    });
  });
});

router.put("/seen", (req, res) => {
  const { sender_id, receiver_id } = req.body;

  const sql = `
    UPDATE messages 
    SET is_seen = 1 
    WHERE sender_id = ? AND receiver_id = ?
  `;

  db.query(sql, [sender_id, receiver_id], (err, result) => {
    res.status(200).json({
      success: true,
      message: "Messages marked as seen"
    });
  });
});

router.get("/users", (req, res) => {
  const sql = "SELECT id, name, username, email, image, bio FROM users";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Fetch Users Error:", err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.status(200).json({
      success: true,
      users: result || []
    });
  });
});

router.put("/update-profile", upload.single("image"), (req, res) => {
  const { id, name } = req.body;
  const bio = req.body.bio || "";

  if (!id || !name) {
    return res.status(400).json({
      success: false,
      message: "ID and Name are required"
    });
  }

  const image = req.file ? req.file.filename : null;

  let sql = "";
  let params = [];

  if (image) {
    sql = "UPDATE users SET name = ?, bio = ?, image = ? WHERE id = ?";
    params = [name, bio, image, id];
  } else {
    sql = "UPDATE users SET name = ?, bio = ? WHERE id = ?";
    params = [name, bio, id];
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log("Update Profile Error:", err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: { id, name, bio, image }
    });
  });
});

module.exports = router;