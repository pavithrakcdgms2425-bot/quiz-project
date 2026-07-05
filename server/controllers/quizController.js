const Quiz = require("../models/Quiz");

// Seconds allowed per question — must match the 15s timer in QuizRoom.jsx.
const SECONDS_PER_QUESTION = 15;
// Small buffer so slow network/db round-trips don't cut off the last
// question before every player has had a fair chance to submit it.
const BUFFER_SECONDS = 10;

// If a quiz is "started" and has been running longer than its allotted
// duration, flip it to "finished" and save. This is called from any
// endpoint the frontend already polls (getQuizById, getLeaderboard), so
// the quiz ends automatically without any admin action, purely from time.
const autoFinishIfExpired = async (quiz) => {
  if (quiz.status === "started" && quiz.startedAt && quiz.duration) {
    const elapsedSeconds = (Date.now() - quiz.startedAt.getTime()) / 1000;

    if (elapsedSeconds >= quiz.duration) {
      quiz.status = "finished";
      await quiz.save();
    }
  }

  return quiz;
};

// Create Quiz
const createQuiz = async (req, res) => {
  try {
    const { title, roomCode } = req.body;

    const quiz = new Quiz({
      title,
      roomCode,
    });

    const savedQuiz = await quiz.save();

    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Quizzes
const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find();

    res.status(200).json(quizzes);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Quiz By ID
const getQuizById = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    quiz = await autoFinishIfExpired(quiz);

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Add Question
const addQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    const { question, options, correctAnswer, points } = req.body;

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    quiz.questions.push({
      question,
      options,
      correctAnswer,
      points,
    });

    await quiz.save();

    res.status(200).json(quiz);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Join Quiz
const joinQuiz = async (req, res) => {
  try {
    const { roomCode } = req.params;
    const { name } = req.body;

    const quiz = await Quiz.findOne({ roomCode });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    // Don't allow anyone to join (or rejoin) a quiz that has already ended.
    if (quiz.status === "finished") {
      return res.status(400).json({
        message: "This quiz has already ended.",
      });
    }

    const playerExists = quiz.players.find(
      (player) => player.name === name
    );

    if (playerExists) {
      if (playerExists.hasCompleted) {
        return res.status(400).json({
          message: "You have already completed this quiz.",
        });
      }

      return res.status(400).json({
        message: "Player already joined",
      });
    }

    quiz.players.push({
      name,
      score: 0,
    });

    await quiz.save();

    res.status(200).json({
      message: "Joined Successfully",
      quiz,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Score
const updateScore = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, score, finished } = req.body;

    let quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    quiz = await autoFinishIfExpired(quiz);

    // Quiz already ended (by time or by admin) — don't accept further
    // score changes. Stops players from continuing to "play" afterward.
    if (quiz.status === "finished") {
      return res.status(400).json({
        message: "This quiz has already ended.",
      });
    }

    const player = quiz.players.find(
      (player) => player.name === name
    );

    if (!player) {
      return res.status(404).json({
        message: "Player not found",
      });
    }

    // Once a player has completed the quiz, their score is locked —
    // they can't submit again to replay or change their result.
    if (player.hasCompleted) {
      return res.status(400).json({
        message: "You have already completed this quiz.",
      });
    }

    player.score = score;

    if (finished) {
      player.hasCompleted = true;
    }

    await quiz.save();

    res.status(200).json({
      message: "Score Updated",
      quiz,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Leaderboard
const getLeaderboard = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    quiz = await autoFinishIfExpired(quiz);

    const leaderboard = [...quiz.players].sort(
      (a, b) => b.score - a.score
    );

    res.status(200).json(leaderboard);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Start Quiz
const startQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    quiz.status = "started";
    quiz.startedAt = new Date();
    quiz.duration =
      quiz.questions.length * SECONDS_PER_QUESTION + BUFFER_SECONDS;

    await quiz.save();

    res.status(200).json({
      message: "Quiz Started",
      quiz,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Finish Quiz — kept as a manual override so the admin can still end the
// quiz early if they want to. Not required anymore: the quiz will also
// finish on its own once `duration` seconds have passed since `startedAt`.
const finishQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    quiz.status = "finished";

    await quiz.save();

    res.status(200).json({
      message: "Quiz Finished",
      quiz,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Quiz
const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
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
};
