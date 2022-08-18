const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
app.use(cors());
// const io = require("socket.io")(http,{
//     cors: {
//         origin: "http://localhost:300/",
//       }
// });
const { Server } = require("socket.io");
const io = new Server(server,{
    cors: {
        origin: "https://public-chat-react.herokuapp.com",
      }
});
const PORT = 4000;
let users = [];
io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on('message', (data) => {
        console.log(data);
        io.emit('messageResponse', data);
      });

      socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

      socket.on('newUser', (data) => {
        console.log('new user :'+ data);
        //Adds the new user to the list of users
        users.push(data);
        // console.log(users);
        //Sends the list of users to the client
        io.emit('newUserResponse', users);
      });

    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      users = users.filter((user) => user.socketID !== socket.id);
      // console.log(users);
      //Sends the list of users to the client
      io.emit('newUserResponse', users);
      socket.disconnect();
    });
});

server.listen(process.env.PORT, () => {
    console.log(`listening on localhost:${PORT}`);
  });
