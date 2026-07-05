import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/ManageQuiz.css";

function ManageQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadQuiz = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/quizzes/${id}`
      );

      setQuiz(res.data);
    } catch (err) {
      console.log(err);
      alert("Unable to load quiz");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();

    const interval = setInterval(loadQuiz, 2000);

    return () => clearInterval(interval);
  }, []);

  const startQuiz = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/quizzes/${id}/start`
      );

      alert("Quiz Started!");

      loadQuiz();
    } catch (err) {
      console.log(err);
      alert("Unable to start quiz");
    }
  };

  const finishQuiz = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/quizzes/${id}/finish`
      );

      alert("Quiz Finished!");

      navigate(`/results/${id}`, { state: { isAdmin: true } });
    } catch (err) {
      console.log(err);
      alert("Unable to finish quiz");
    }
  };

  if (loading) {
    return (
      <div className="manage-status">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="manage-status">
        <h2>Quiz not found.</h2>
      </div>
    );
  }

  return (
    <div className="manage-page">
      <div className="manage-card">
        <h1>{quiz.title}</h1>

        <h2 className="manage-room-code">Room Code: {quiz.roomCode}</h2>

        <h3>Status: {quiz.status}</h3>
        <h3>Questions: {quiz.questions.length}</h3>

        <hr className="manage-divider" />

        <h2>📚 Questions</h2>

        {quiz.questions.length === 0 ? (
          <p className="manage-empty">No questions added yet.</p>
        ) : (
          quiz.questions.map((q, index) => (
            <div className="manage-question" key={q._id}>
              <h3>
                {index + 1}. {q.question}
              </h3>

              <ul>
                {q.options.map((option, i) => (
                  <li key={i}>
                    {option}
                    {i === q.correctAnswer && " ✅"}
                  </li>
                ))}
              </ul>

              <strong>Points:</strong> {q.points}
            </div>
          ))
        )}

        <hr className="manage-divider" />

        <h2>👥 Players Joined</h2>

        {quiz.players.length === 0 ? (
          <p className="manage-empty">No players have joined yet.</p>
        ) : (
          <div className="manage-players">
            {quiz.players.map((player) => (
              <div className="manage-player-row" key={player._id}>
                <span>{player.name}</span>
                <span>{player.score} pts</span>
              </div>
            ))}
          </div>
        )}

        <div className="manage-actions">
          {quiz.status === "waiting" && (
            <button
              className="manage-btn-start"
              onClick={startQuiz}
              disabled={quiz.players.length === 0}
            >
              ▶ Start Quiz
            </button>
          )}

          {quiz.status === "started" && (
            <button className="manage-btn-end" onClick={finishQuiz}>
              🛑 End Quiz
            </button>
          )}

          {quiz.status === "finished" && (
            <button
              className="manage-btn-results"
              onClick={() =>
                navigate(`/results/${quiz._id}`, {
                  state: { isAdmin: true },
                })
              }
            >
              🏆 View Results
            </button>
          )}
        </div>

        <button
          className="manage-btn-back"
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ManageQuiz;
