import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/Results.css";

function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Only requests that arrive here from an admin screen (AdminDashboard /
  // ManageQuiz) carry isAdmin: true in navigation state. Players finishing
  // a quiz never set this, so they never see the Dashboard button.
  const isAdmin = location.state?.isAdmin === true;

  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/${id}/leaderboard`
      );

      setLeaderboard(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load leaderboard.");
    }
  };

  return (
    <motion.div
      className="results-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="results-card">
        <h1>🏆 Quiz Results</h1>

        {leaderboard.length === 0 ? (
          <p className="results-empty">No Players</p>
        ) : (
          <>
            <h2 className="results-winner">
              👑 Winner: {leaderboard[0].name}
            </h2>

            <hr className="results-divider" />

            <div className="results-list">
              {leaderboard.map((player, index) => (
                <div className="result-player" key={player._id}>
                  <span>#{index + 1}</span>
                  <span>{player.name}</span>
                  <span>{player.score} pts</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="results-actions">
          <button
            className="results-btn-home"
            onClick={() => navigate("/")}
          >
            🏠 Go Home
          </button>

          {isAdmin && (
            <button
              className="results-btn-dashboard"
              onClick={() => navigate("/dashboard")}
            >
              📊 Dashboard
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default Results;
