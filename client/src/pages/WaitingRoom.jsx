import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/WaitingRoom.css";

function WaitingRoom() {
  const location = useLocation();
  const navigate = useNavigate();

  const quiz = location.state?.quiz;
  const playerName = location.state?.playerName;

  useEffect(() => {
    if (!quiz) return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quizzes/${quiz._id}`
        );

        // Admin started the quiz
        if (response.data.status === "started") {
          clearInterval(interval);

          navigate("/quizroom", {
            state: {
              quiz: response.data,
              playerName,
            },
          });
        }

        // Admin finished the quiz
        if (response.data.status === "finished") {
          clearInterval(interval);

          navigate(`/results/${quiz._id}`);
        }
      } catch (error) {
        console.log(error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [quiz, navigate, playerName]);

  if (!quiz) {
    return (
      <div className="waiting-empty">
        <h2>No Quiz Found.</h2>
      </div>
    );
  }

  return (
    <div className="waiting-page">
      <div className="waiting-card">
        <h1>{quiz.title}</h1>

        <h2>Room Code</h2>

        <h1 className="waiting-room-code">
          {quiz.roomCode}
        </h1>

        <h3 className="waiting-welcome">
          Welcome, {playerName}
        </h3>

        <div className="waiting-status">
          <h2>⏳ Waiting for Admin to Start the Quiz...</h2>

          <p className="waiting-hint">
            This page refreshes automatically every 2 seconds.
          </p>
        </div>
      </div>
    </div>
  );
}

export default WaitingRoom;