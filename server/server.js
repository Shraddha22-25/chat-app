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

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("Database Connected Successfully");
    }
});

// Home Route
app.get("/", (req, res) => {
    res.send("Server is running...");
});

// Test API
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API Working Successfully"
    });
});
io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);

    socket.on("send_message", (data) => {

        socket.broadcast.emit("receive_message", data);

    });

    socket.on("disconnect", () => {

        console.log("User Disconnected:", socket.id);

    });

});
// Server
const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});