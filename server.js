const express = require('express');
const socketIO = require("socket.io");

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));


const io = socketIO(server);
let roundWinner = null;

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on("bingo", bingoHandler)

  setInterval(() => io.emit('ping', new Date().getTime()), 1000);  
});

function bingoHandler(player){
  if (roundWinner === null) {
    roundWinner = player; 
    io.emit("result", roundWinner);
    setTimeout(() => {
      roundWinner = null;
      io.emit("unlock")
    }, 2000);
  } else {
    io.emit("result", roundWinner);
  }
}
