import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Leaderboard.css";

function Leaderboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz;

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${quiz._id}/leaderboard`
        );

        setPlayers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (quiz) {
      fetchLeaderboard();
    }
  }, [quiz]);

  if (!quiz) {
    return <h2>No leaderboard available.</h2>;
  }

  return (
    <motion.div
      className="leaderboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>{quiz.title}</h1>

<h2>🏆 Leaderboard</h2>

      <div className="leaderboard-container">
        {players.map((player, index) => (
          <motion.div
            className="player-card"
            key={index}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.2 }}
          >
            <span>
  {index === 0
    ? "🥇"
    : index === 1
    ? "🥈"
    : index === 2
    ? "🥉"
    : `#${index + 1}`}
</span>

            <span>{player.name}</span>

            <span>{player.score} pts</span>
          </motion.div>
        ))}
      </div>

      <button
        style={{ marginTop: "30px" }}
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </motion.div>
  );
}

export default Leaderboard;