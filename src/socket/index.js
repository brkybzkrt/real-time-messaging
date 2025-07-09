import { Server } from 'socket.io';
import { authenticate } from './authentication.js';
import redisClient from '../utils/redis.util.js';
import registerUserEvents    from './user.events.js';
import registerMessageEvents from './message.events.js';

export default function initSocket(server) {
  const io = new Server(server, { cors: { origin: '*' } });

  // Global middleware
  io.use(authenticate);

  io.on('connection', socket => {
    console.log('User connected');

    
    redisClient.sAdd('onlineUsers', socket.user._id.toString()).then(async () => {
      const data = await redisClient.sMembers('onlineUsers');
      io.emit('onlineUsers', data);
      socket.broadcast.emit('user_online', socket.user._id.toString());
    });

    socket.on('disconnect', () => {
      redisClient.sRem('onlineUsers', socket.user._id.toString()).then(async () => {
        const data = await redisClient.sMembers('onlineUsers');
        io.emit('onlineUsers', data);
        socket.broadcast.emit('user_offline', socket.user._id.toString());

      });

    });


    registerUserEvents(io, socket, redisClient);
    registerMessageEvents(io, socket);
  });



  return io;
}
