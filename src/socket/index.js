import { Server } from 'socket.io';
import { authenticate } from './authentication.js';
import redisClient from '../utils/redis.util.js';
import registerUserEvents    from './user.events.js';
import registerMessageEvents from './message.events.js';


let ioInstance;

export function getIO() {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized!');
  }
  return ioInstance;
}


export default function initSocket(server) {
  const io = new Server(server, { cors: { origin: '*' },connectionStateRecovery: {} });

  ioInstance = io; 

  // Global middleware
  io.use(authenticate);

  io.on('connection', socket => {
    console.log('User connected');

    socket.join(socket.user._id.toString());
    console.log("User joined personal room: ", socket.user._id.toString());
    
    redisClient.sAdd('onlineUsers', socket.user._id.toString()).then(async () => {
      const data = await redisClient.sMembers('onlineUsers');
      io.emit('onlineUsers', data);
      socket.broadcast.emit('user_online', socket.user._id.toString());
    });

    socket.on('disconnect', () => {
      redisClient.sRem('onlineUsers', socket.user._id.toString()).then(async () => {
        socket.leave(socket.user._id.toString());
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
