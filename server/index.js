require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());
const server = http.createServer(app);

const leaveRoom = require("./utils/leave-room");
const harperSaveMessage = require("./services/harper-save-message");
const harperGetMessages = require("./services/harper-get-messages");
// const { all } = require("axios");
///////////////////////////////////////////////////////////////////////////////
//create io server and allow for CORS from localhost: 3000 with get and post metthods
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
    console.log("created time: ", __createdtime__);

    //send message to all users currently in the room, apart from the sender
    socket.to(room).emit("receive_message", {
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

    //Get message history from db
    harperGetMessages(room)
      .then((last100Messages) => {
        socket.emit("last_100_messages", last100Messages);
      })
      .catch((err) => console.log(err));
  });

  //Send message and save message history to db
  socket.on("send_message", (data) => {
    const { message, username, room, __createdtime__ } = data;
    io.in(room).emit("receive_message", data); // Send to all users in room, including sender
    harperSaveMessage(message, username, room, __createdtime__) // Save message in db
      .then((response) => console.log(response))
      .catch((err) => console.log(err));
  });

  //When user leaves
  socket.on("leave_room", (data) => {
    const { username, room } = data;
    socket.leave(room);
    const __createdtime__ = Date.now();
    //Remove user from memory
    allUsers = leaveRoom(socket.id, allUsers);
    socket.to(room).emit("chatroom_users", allUsers);
    socket.to(room).emit("receive_message", {
      username: CHAT_BOT,
      message: `${username} has left the chat.`,
      __createdtime__,
    });
    console.log(`User ${username}} left room: ${room}`);
  });
  
  //When user disconnects
  socket.on("disconnect", () => {
    const __createdtime__ = Date.now();
    console.log("User disconnected");
    const user = allUsers.find((user) => user.id === socket.id);
    if (user && user.username) {
      allUsers = leaveRoom(socket.id, allUsers);
      socket.to(chatRoom).emit("chatroom_users", allUsers);
      socket.to(chatRoom).emit("receive_message", {
        message: `${user.username} has disconnected.`,
        __createdtime__,
      });
    }
  });
});

///////////////////////////////////////////////////////////////////////////////
//listen on port 4000
server.listen(4000, () => {
  console.log("listening on port: 4000");
});
