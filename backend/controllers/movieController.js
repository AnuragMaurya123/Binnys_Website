const { getRabbitMQChannel } = require("../config/rabbitmq");
const Movie = require("../models/Movie");

// Get all movies (No change needed)
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve movies", error });
  }
};

// Add a movie
exports.addMovie = async (req, res) => {
  try {
    const movieData = req.body;
    const channel = getRabbitMQChannel();
    channel.sendToQueue(
      "movieQueue",
      Buffer.from(JSON.stringify({ action: "add", data: movieData }))
    );
    res.status(202).json({ message: "Movie addition queued successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to queue movie addition", error });
  }
};

// Edit a movie
exports.editMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const channel = getRabbitMQChannel();
    channel.sendToQueue(
      "movieQueue",
      Buffer.from(
        JSON.stringify({ action: "edit", id, data: updatedData })
      )
    );
    res.status(202).json({ message: "Movie update queued successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to queue movie update", error });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const channel = getRabbitMQChannel();
    channel.sendToQueue(
      "movieQueue",
      Buffer.from(JSON.stringify({ action: "delete", id }))
    );
    res.status(202).json({ message: "Movie deletion queued successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to queue movie deletion", error });
  }
};
