import Message from '../models/message.model.js';

export default function registerMessageEvents(io, socket) {

  socket.on('send_message', async ({ conversationId, content }, ack) => {
    try {
      if (!content) return ack({ status: 'error', msg: 'Empty message' });

      // save to db
      const message = await Message.create({
        conversation: conversationId,
        sender: socket.user._id,
        content,
      });

      // emit to room (except sender)
      socket.to(conversationId).emit('message_received_notification', {
        _id:     message._id,
        sender:  socket.user._id,
        content, 
        createdAt: message.createdAt,
      });


      ack({ status: 'ok', messageId: message._id });
    } catch (err) {
      ack({ status: 'error', msg: err.message });
    }
  });

  socket.on('typing', ({ conversationId, isTyping }) => {
    socket.to(conversationId).emit('typing', {
      userId: socket.user._id,
      isTyping,
    });
  });
}
