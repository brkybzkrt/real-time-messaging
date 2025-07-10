import cron          from 'node-cron';
import redisClient   from '../utils/redis.util.js';
import AutoMessage   from '../models/autoMessage.model.js';

cron.schedule('* 2 * * *', async () => {
  console.log('⏰ Cron: AutoMessage planning');

  const onlineIds = await redisClient.sMembers('onlineUsers');
  if (onlineIds.length < 2) {
    console.log('There are not enough online users');
    return;
  }
  else {
    // Shuffle
    for (let i = onlineIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [onlineIds[i], onlineIds[j]] = [onlineIds[j], onlineIds[i]];
    }

  // Pair & create
  for (let k = 0; k < onlineIds.length - 1; k += 2) {
    await AutoMessage.create({
      sender:   onlineIds[k],
      receiver: onlineIds[k + 1],
      content:  'Hello from cron!',
      sendDate: new Date(),
    });
  }

  console.log(`${Math.floor(onlineIds.length / 2)} messages were planned`);

  }
});
