export default function registerUserEvents(io, socket, redis) {

    /**
     * Join room
     */
    socket.on('join_room', ({ conversationId }) => {
      socket.join(conversationId);
    });
  
    /**
     * Leave room
     */
    socket.on('leave_room', ({ conversationId }) => {
      socket.leave(conversationId);
    });
  }
  