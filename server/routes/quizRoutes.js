const express = require("express");
const router = express.Router();

const {
  createQuiz,
  getAllQuizzes,
  getQuizById,
  addQuestion,
  joinQuiz,
  updateScore,
  getLeaderboard,
  startQuiz,
  finishQuiz,
  deleteQuiz,
} = require("../controllers/quizController");

// Create Quiz
router.post("/", createQuiz);

// Get All Quizzes
router.get("/", getAllQuizzes);

// Get Quiz By ID
router.get("/:id", getQuizById);

// Add Question
router.post("/:id/questions", addQuestion);

// Join Quiz
router.post("/join/:roomCode", joinQuiz);

// Update Score
router.put("/:id/score", updateScore);

// Leaderboard
router.get("/:id/leaderboard", getLeaderboard);

// Start Quiz
router.put("/:id/start", startQuiz);

router.put("/:id/finish", finishQuiz);

router.delete("/:id", deleteQuiz);

module.exports = router;