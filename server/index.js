const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

const server = http.createServer(app);

//create io server and allow for CORS from localhost: 300 with get and post metthods

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

//listen for connection event from client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);
});

server.listen(4000, () => {
  console.log("listening on port: 4000");
});
