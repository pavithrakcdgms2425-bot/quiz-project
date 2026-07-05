import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/JoinQuiz.css";

function JoinQuiz() {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!name || !roomCode) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/quizzes/join/${roomCode}`,
        {
          name,
        }
      );

      alert("Joined Successfully!");

      navigate("/waitingroom", {
        state: {
          quiz: response.data.quiz,
          playerName: name,
        },
      });

    } catch (error) {
      console.error(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <motion.div
      className="join-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="join-card">
        <h1>Join Quiz</h1>

        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) =>
            setRoomCode(e.target.value.toUpperCase())
          }
        />

        <button onClick={handleJoin}>
          Join Quiz
        </button>
      </div>
    </motion.div>
  );
}

export default JoinQuiz;