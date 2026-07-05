import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/QuizRoom.css";

function QuizRoom() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz;
  const playerName = location.state?.playerName;

  if (!quiz) {
    return <h2>No quiz found.</h2>;
  }

  const questions = quiz.questions;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [liveLeaderboard, setLiveLeaderboard] = useState([]);

  // True once this player has answered their own last question. They then
  // wait here (instead of jumping straight to Results) until the quiz is
  // actually finished for everyone.
  const [finishedWaiting, setFinishedWaiting] = useState(false);

  // Update player's score in MongoDB. Called after every question (not
  // just the last one) so the leaderboard reflects progress in real time.
  // `finished` is only true on the last question — it tells the backend
  // to lock this player's score so they can't submit again.
  const updatePlayerScore = async (finalScore, finished = false) => {
    try {
      await axios.put(
        `http://localhost:5000/api/quizzes/${quiz._id}/score`,
        {
          name: playerName,
          score: finalScore,
          finished,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Poll the leaderboard every 3 seconds while the quiz is in progress.
  useEffect(() => {
    const loadLiveLeaderboard = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/${quiz._id}/leaderboard`
        );

        setLiveLeaderboard(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadLiveLeaderboard();

    const interval = setInterval(loadLiveLeaderboard, 3000);

    return () => clearInterval(interval);
  }, []);

  // Once this player has finished their own questions, stop polling the
  // leaderboard-only endpoint and instead poll the quiz itself so we know
  // the moment it's *actually* finished (by the admin / overall quiz end),
  // not just finished for this one player.
  useEffect(() => {
    if (!finishedWaiting) return;

    const checkQuizStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/quizzes/${quiz._id}`
        );

        if (res.data.status === "finished") {
          navigate(`/results/${quiz._id}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkQuizStatus();

    const interval = setInterval(checkQuizStatus, 3000);

    return () => clearInterval(interval);
  }, [finishedWaiting]);

  // Save the score for this question, then either move on or wait.
  const submitAndAdvance = async (finalScore) => {
    const isLastQuestion = currentQuestion === questions.length - 1;

    await updatePlayerScore(finalScore, isLastQuestion);

    if (isLastQuestion) {
      // Don't navigate to Results yet — wait for the quiz to actually end.
      setFinishedWaiting(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelected("");
      setTimeLeft(15);
    }
  };

  // Timer
  useEffect(() => {
    if (finishedWaiting) return;

    if (timeLeft === 0) {
      submitAndAdvance(score);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finishedWaiting]);

  // Submit answer
  const handleSubmit = async () => {
    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    const selectedIndex =
      questions[currentQuestion].options.indexOf(selected);

    let newScore = score;

    if (
      selectedIndex ===
      questions[currentQuestion].correctAnswer
    ) {
      newScore += questions[currentQuestion].points;
      setScore(newScore);
    }

    await submitAndAdvance(newScore);
  };

  return (
    <motion.div
      className="quiz-room"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="quiz-card">
        {finishedWaiting ? (
          <>
            <h1>{quiz.title}</h1>
            <p>Player: {playerName}</p>

            <h2 className="quiz-waiting-title">✅ You're done!</h2>
            <h4>Your Score: {score}</h4>

            <p className="quiz-waiting-hint">
              Waiting for the quiz to end for everyone before showing the
              final leaderboard...
            </p>
          </>
        ) : (
          <>
            <h1>{quiz.title}</h1>
            <p>Player: {playerName}</p>
            <h3>
              Question {currentQuestion + 1} / {questions.length}
            </h3>

            <h3>⏳ {timeLeft} seconds</h3>

            <h4>Score: {score}</h4>

            <h2>{questions[currentQuestion].question}</h2>

            <div className="options">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={selected === option ? "selected" : ""}
                  onClick={() => setSelected(option)}
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={!selected}
            >
              {currentQuestion === questions.length - 1
                ? "Finish Quiz"
                : "Next Question"}
            </button>
          </>
        )}
      </div>

      <div className="live-leaderboard">
        <h3>🔥 Live Leaderboard</h3>

        {liveLeaderboard.length === 0 ? (
          <p className="live-leaderboard-empty">Waiting for scores...</p>
        ) : (
          <div className="live-leaderboard-list">
            {liveLeaderboard.map((player, index) => (
              <div
                className={
                  "live-leaderboard-row" +
                  (player.name === playerName ? " me" : "")
                }
                key={player._id}
              >
                <span className="live-leaderboard-rank">
                  #{index + 1}
                </span>
                <span>{player.name}</span>
                <span>{player.score} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default QuizRoom;
