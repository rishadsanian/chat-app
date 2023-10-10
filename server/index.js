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

const CHAT_BOT = "Administrator";
let chatRoom = "";
let allUsers = [];

//listen for connection event from client
io.on("connection", (socket) => {
  console.log(`User connected ${socket.id}`);

  //add user into the room
  socket.on("join_room", (data) => {
    const { username, room } = data;
    console.log(
      `User with ID: ${socket.id} joined room: ${data}, username: ${username}})`
    );
    socket.join(room);

    //created time
    let __createdtime__ = Date.now();
    console.log("created time: " , __createdtime__);

    //send message to all users currently in the room, apart from the sender
    socket
      .to(room)
      .emit("receive_message", {
        message: `${username} has joined the room. `,
        username: CHAT_BOT,
        __createdtime__,
      });

    //send message to the sender
    socket.emit("receive_message", {
      message: `Welcome ${username}`,
      username: CHAT_BOT,
      __createdtime__,
    });

    //Save new user to the room
    chatRoom = room;
    allUsers.push({ id: socket.id, username, room });
    let chatRoomUsers = [];
    chatRoomUsers = allUsers.filter((user) => user.room === room);
    socket.to(room).emit("chatroom_users", chatRoomUsers);
    socket.emit("chatroom_users", chatRoomUsers);
  });
});

//listen on port 4000
server.listen(4000, () => {
  console.log("listening on port: 4000");
});
