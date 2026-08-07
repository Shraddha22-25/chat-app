const express = require("express");
const router = express.Router();
const db = require("../config/db");
const upload = require("../config/multer");

router.post("/send", (req, res) => {

    const { sender_id, receiver_id, message } = req.body;

    if (!sender_id || !receiver_id || !message) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `
        INSERT INTO messages (sender_id, receiver_id, message)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [sender_id, receiver_id, message], (err, result) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Message not sent"
            });
        }

        res.status(201).json({
            success: true,
            message: "Message Sent Successfully"
        });

    });

});

router.get("/messages/:senderId/:receiverId", (req, res) => {

    const { senderId, receiverId } = req.params;

    const sql = `
        SELECT * FROM messages
        WHERE
        (sender_id = ? AND receiver_id = ?)
        OR
        (sender_id = ? AND receiver_id = ?)
        ORDER BY created_at ASC
    `;

    db.query(
        sql,
        [senderId, receiverId, receiverId, senderId],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error fetching messages"
                });
            }

            res.status(200).json({
                success: true,
                messages: result
            });

        }
    );

});
// Get All Users
router.get("/users", (req, res) => {
    const sql = "SELECT id, name, email, image FROM users";
    db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Failed to fetch users"
            });
        }
        res.json({
            success: true,
            users: result
        });

    });

});
// Update Profile
router.put("/update-profile", upload.single("image"), (req, res) => {

    const { id, name, bio } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!id || !name || !bio) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    let image = null;

    if (req.file) {
        image = req.file.filename;

        const sql = `
            UPDATE users
            SET name = ?, bio = ?, image = ?
            WHERE id = ?
        `;

        db.query(sql, [name, bio, image, id], (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Profile Updated Successfully"
            });

        });

    } else {

        const sql = `
            UPDATE users
            SET name = ?, bio = ?
            WHERE id = ?
        `;

        db.query(sql, [name, bio, id], (err, result) => {

            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            res.json({
                success: true,
                message: "Profile Updated Successfully"
            });

        });

    }

});
module.exports = router;