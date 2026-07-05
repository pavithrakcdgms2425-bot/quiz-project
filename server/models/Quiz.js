const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  score: {
    type: Number,
    default: 0,
  },

  // True once this player has answered their own last question.
  // Prevents them from resubmitting scores / rejoining and replaying.
  hasCompleted: {
    type: Boolean,
    default: false,
  },
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  roomCode: {
    type: String,
    required: true,
    unique: true,
  },

  status: {
    type: String,
    default: "waiting",
  },

  // Set when the admin starts the quiz. Used together with `duration`
  // to automatically finish the quiz without any admin action.
  startedAt: {
    type: Date,
    default: null,
  },

  // Total time (in seconds) the quiz is allowed to run once started.
  duration: {
    type: Number,
    default: null,
  },

  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: Number,
      points: Number,
    },
  ],

  players: [playerSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
