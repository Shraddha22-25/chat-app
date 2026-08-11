const express = require("express");
const cors = require("cors");
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  "https://chat-app-cdv2.vercel.app"
];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("Chat App Server is running smoothly...");
});

db.connect((err) => {
  if (err) {
    console.log("Database Connection Failed", err);
  } else {
    console.log("Database Connected Successfully");

    const fixSchema = "ALTER TABLE users ADD COLUMN name VARCHAR(100) DEFAULT 'User'";
    db.query(fixSchema, (fixErr) => {
      if (fixErr) {
        console.log("Schema check: 'name' column exists.");
      } else {
        console.log("SUCCESS: Aiven Cloud DB me 'name' column add ho gaya!");
      }
    });
  }
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("user_online", (userId) => {
    console.log(`User ${userId} is online`);
  });

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});