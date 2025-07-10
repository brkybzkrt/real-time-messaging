// src/rabbitmq/message.consumer.js
import { getChannel } from './index.js';
import AutoMessage    from '../models/autoMessage.model.js';
import Message        from '../models/message.model.js';
import Conversation   from '../models/conversation.model.js';
import { getIO }      from '../socket/index.js';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
  const channel = await getChannel();

  channel.consume(process.env.QUEUE_MESSAGE_SEND, async (msg) => {
    if (!msg) return;
    const auto = JSON.parse(msg.content.toString());

    // find or create conversation
    let convo = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [auto.sender, auto.receiver], $size: 2 },
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [auto.sender, auto.receiver],
        isGroup: false,
      });
    }

    // create message
    const message = await Message.create({
      conversation: convo._id,
      sender: auto.sender,
      content: auto.content,
    });

    // emit to user
    getIO().to(auto.receiver.toString()).emit('message_received', {
      _id: message._id,
      conversation: convo._id,
      sender: auto.sender,
      content: auto.content,
      createdAt: message.createdAt,
    });

    // update auto message
    await AutoMessage.findByIdAndUpdate(auto._id, { isSent: true, isQueued: true });
    channel.ack(msg);

    console.log('Message was sent', message.content);
  });
})();
