const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET || "mySecretKey";

router.post("/register", (req, res) => {
  const { email, password } = req.body;

  const name = req.body.name || req.body.username || req.body.fullName;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields"
    });
  }

  const checkEmail = "SELECT * FROM users WHERE email = ?";

  db.query(checkEmail, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error: " + err.message
      });
    }

    if (result && result.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(sql, [name, email, hashedPassword], (insertErr, insertResult) => {
        if (insertErr) {
          return res.status(500).json({
            success: false,
            message: "Registration Failed: " + insertErr.message
          });
        }

        res.status(201).json({
          success: true,
          message: "User Registered Successfully"
        });
      });
    } catch (hashErr) {
      res.status(500).json({
        success: false,
        message: "Password hashing error"
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please fill all fields"
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Database Error"
      });
    }

    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const user = result[0];

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid Password"
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email
        },
        JWT_SECRET,
        {
          expiresIn: "1d"
        }
      );

      res.status(200).json({
        success: true,
        message: "Login Successful",
        token: token,
        user: {
          id: user.id,
          name: user.name || user.username || user.email.split("@")[0],
          email: user.email,
          image: user.image || null,
          bio: user.bio || ""
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Authentication error"
      });
    }
  });
});

module.exports = router;