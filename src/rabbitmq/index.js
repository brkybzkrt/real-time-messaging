import amqplib from 'amqplib';
import dotenv from 'dotenv';
dotenv.config();

let channel;

export async function getChannel() {
  if (channel) return channel;

  const conn = await amqplib.connect(process.env.RABBITMQ_URL);
  channel = await conn.createChannel();
  await channel.assertQueue(process.env.QUEUE_MESSAGE_SEND, { durable: true });
  console.log('🐇 RabbitMQ connected');
  return channel;
}
