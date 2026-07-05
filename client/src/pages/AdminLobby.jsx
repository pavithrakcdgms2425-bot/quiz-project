import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/AdminLobby.css";

function AdminLobby() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz;

  const [currentQuiz, setCurrentQuiz] = useState(quiz);

  useEffect(() => {
    if (!quiz) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${quiz._id}`
        );

        setCurrentQuiz(response.data);
      } catch (err) {
        console.log(err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [quiz]);

  const startQuiz = async () => {
    try {
      await axios.put(`http://localhost:5000/api/quizzes/${quiz._id}/start`);

      const response = await axios.get(
        `http://localhost:5000/api/quizzes/${quiz._id}`
      );

      navigate("/quizroom", {
        state: {
          quiz: response.data,
          playerName: "Admin",
        },
      });
    } catch (err) {
      console.log(err);
      alert("Couldn't start quiz.");
    }
  };

  if (!currentQuiz) {
    return (
      <div className="lobby-empty-page">
        <h2>No Quiz Found.</h2>
      </div>
    );
  }

  return (
    <div className="lobby-page">
      <div className="lobby-card">
        <h1>{currentQuiz.title}</h1>

        <h2>Room Code</h2>
        <h1 className="lobby-room-code">{currentQuiz.roomCode}</h1>

        <hr className="lobby-divider" />

        <h2>Players Joined ({currentQuiz.players.length})</h2>

        {currentQuiz.players.length === 0 ? (
          <p className="lobby-empty">No players yet...</p>
        ) : (
          <div className="lobby-players">
            {currentQuiz.players.map((player) => (
              <div className="lobby-player-row" key={player._id}>
                👤 {player.name}
              </div>
            ))}
          </div>
        )}

        <button
          className="lobby-start-btn"
          onClick={startQuiz}
          disabled={currentQuiz.players.length === 0}
        >
          ▶ Start Quiz
        </button>
      </div>
    </div>
  );
}

export default AdminLobby;
