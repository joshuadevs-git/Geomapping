require("dotenv").config();
const path = require("path");
const express = require("express"); 
const routes = require("./routes/routes");
const { getConnection } = require("./model/databasesql");
const session = require('express-session');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "default"));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "files")));

// Middleware to parse request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || "secret123",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set true if HTTPS
}));

// ✅ MySQL connection test
(async () => {
    try {
        const conn = await getConnection();
        console.log("MySQL (mysql2) Connected Successfully!");
        conn.release();
    } catch (err) {
        console.error("MySQL (mysql2) Connection Failed:", err.message);
    }
})();

// ✅ Socket.io
io.on('connection', (socket) => {
    console.log('New user connected:', socket.id);

    socket.on('join-room', (room) => {
        if (room === 'staff' || room === 'youth') {
            socket.join(room);
            console.log(`User ${socket.id} joined ${room} room`);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible in routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use("/", routes);

// Start server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});