const { connectRabbitMQ, getRabbitMQChannel } = require("../config/rabbitmq");
const Movie = require("../models/Movie");

const initializeConsumer = async () => {
  try {
    await connectRabbitMQ(); // Ensure RabbitMQ is connected
    const channel = getRabbitMQChannel();

    await channel.assertQueue("movieQueue");
    console.log("RabbitMQ Consumer connected and listening for messages");

    channel.consume("movieQueue", async (msg) => {
      if (msg) {
        const message = JSON.parse(msg.content.toString());
        const { action, id, data } = message;

        try {
          switch (action) {
            case "add":
              const newMovie = new Movie(data);
              await newMovie.save();
              console.log("Movie added successfully:", newMovie);
              break;

            case "edit":
              const updatedMovie = await Movie.findByIdAndUpdate(id, data, {
                new: true,
              });
              console.log("Movie updated successfully:", updatedMovie);
              break;

            case "delete":
              await Movie.findByIdAndDelete(id);
              console.log("Movie deleted successfully:", id);
              break;

            default:
              console.error("Unknown action:", action);
          }
          // Acknowledge the message after processing
          channel.ack(msg);
        } catch (error) {
          console.error("Failed to process message:", error);
        }
      }
    });
  } catch (error) {
    console.error("Failed to initialize RabbitMQ Consumer", error);
  }
};

// Start the consumer
initializeConsumer();
