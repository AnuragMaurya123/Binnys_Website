const express = require("express");
const { getAllMovies, addMovie, editMovie, deleteMovie } = require("../controllers/movieController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const router = express.Router();

router.get("/", authMiddleware, getAllMovies);
router.post("/", authMiddleware, roleMiddleware("admin"), addMovie);
router.put("/:id", authMiddleware, roleMiddleware("admin"), editMovie);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteMovie);

module.exports = router;
