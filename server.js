const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

/* init port */
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

/* root level endpoint */
app.get('/', async (req, res) => {
     return res.redirect(`/${uuidV4()}`);
});

app.get('/:room', async (req, res) => {
     return res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
     socket.on('join-room', (roomId, userId) => {
          console.log(roomId, userId);
          socket.join(roomId);
          socket.to(roomId).emit('user-connected', userId);

          socket.on('disconnect', () => {
               socket.to(roomId).emit('user-disconnect', userId);
          });
     });
});

server.listen(PORT);
