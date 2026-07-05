import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all quizzes
  const loadQuizzes = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/quizzes"
      );

      setQuizzes(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();

    // Refresh every 5 seconds
    const interval = setInterval(() => {
      loadQuizzes();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Delete quiz
  const deleteQuiz = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this quiz?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/quizzes/${id}`
      );

      alert("Quiz deleted successfully.");

      loadQuizzes();
    } catch (err) {
      console.log(err);
      alert("Unable to delete quiz.");
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>🎯 Admin Dashboard</h1>

        <button
          className="dashboard-create-btn"
          onClick={() => navigate("/createquiz")}
        >
          ➕ Create New Quiz
        </button>
      </div>

      {loading ? (
        <p className="dashboard-status">Loading...</p>
      ) : quizzes.length === 0 ? (
        <p className="dashboard-status">No quizzes created yet.</p>
      ) : (
        <div className="dashboard-list">
          {quizzes.map((quiz) => (
            <div className="dashboard-quiz-card" key={quiz._id}>
              <h2>{quiz.title}</h2>

              <div className="dashboard-quiz-meta">
                <p>
                  <strong>Room Code:</strong>{" "}
                  <span className="dashboard-quiz-code">
                    {quiz.roomCode}
                  </span>
                </p>

                <p>
                  <strong>Status:</strong> {quiz.status}
                </p>

                <p>
                  <strong>Questions:</strong> {quiz.questions.length}
                </p>

                <p>
                  <strong>Players Joined:</strong> {quiz.players.length}
                </p>
              </div>

              {quiz.players.length > 0 && (
                <>
                  <hr className="dashboard-divider" />

                  <h3>👥 Players</h3>

                  <div className="dashboard-players">
                    {quiz.players.map((player) => (
                      <div className="dashboard-player-row" key={player._id}>
                        <span>{player.name}</span>
                        <span>{player.score} pts</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className="dashboard-actions">
                <button
                  className="dashboard-btn-manage"
                  onClick={() => navigate(`/managequiz/${quiz._id}`)}
                >
                  ⚙ Manage Quiz
                </button>

                {quiz.status === "finished" && (
                  <button
                    className="dashboard-btn-results"
                    onClick={() =>
                      navigate(`/results/${quiz._id}`, {
                        state: { isAdmin: true },
                      })
                    }
                  >
                    🏆 View Results
                  </button>
                )}

                <button
                  className="dashboard-btn-delete"
                  onClick={() => deleteQuiz(quiz._id)}
                >
                  🗑 Delete Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
