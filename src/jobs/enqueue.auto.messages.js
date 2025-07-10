import cron from 'node-cron';
import { getChannel } from '../rabbitmq/index.js';
import AutoMessage from '../models/autoMessage.model.js';
import dotenv from 'dotenv';
dotenv.config();

cron.schedule('* * * * *', async () => {
  const due = await AutoMessage.find({
    sendDate: { $lte: new Date() },
    isQueued: false,
  });

  if (!due.length) {
    console.log('No due messages');
    return;
  }
  else {
    const channel = await getChannel();

    for (const msg of due) {
      channel.sendToQueue(
        process.env.QUEUE_MESSAGE_SEND,
        Buffer.from(JSON.stringify(msg)),
        { persistent: true }
      );
  
      msg.isQueued = true;
      await msg.save();
    }
  
    console.log(`${due.length} messages were added to queue`);
  }
});
