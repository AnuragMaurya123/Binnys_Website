const amqp = require("amqplib");

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error("Failed to connect to RabbitMQ:", error.message);
  }
};

const getRabbitMQChannel = () => {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  return channel;
};

module.exports = { connectRabbitMQ, getRabbitMQChannel };
