import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Admin.css";

function CreateQuiz() {
  const [quizTitle, setQuizTitle] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const navigate = useNavigate();

  // Generate Random Room Code
  const generateCode = () => {
    const code = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();

    setRoomCode(code);
  };

  // Create Quiz
  const createQuiz = async () => {
    if (!quizTitle.trim()) {
      alert("Please enter quiz title.");
      return;
    }

    if (!roomCode) {
      alert("Generate room code first.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/quizzes",
        {
          title: quizTitle,
          roomCode,
        }
      );

      alert("✅ Quiz Created Successfully!");

      navigate("/addquestions", {
        state: {
          quiz: response.data,
        },
      });
    } catch (error) {
      console.log(error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Failed to create quiz.");
      }
    }
  };

  return (
    <motion.div
      className="admin-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="admin-card">
        <h1>Create Quiz</h1>

        <input
          type="text"
          placeholder="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />

        <button onClick={generateCode}>
          Generate Room Code
        </button>

        {roomCode && (
          <>
            <div className="room-code">
              Room Code: <strong>{roomCode}</strong>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(roomCode);
                alert("Room Code Copied!");
              }}
            >
              Copy Room Code
            </button>
          </>
        )}

        <button
          onClick={createQuiz}
          disabled={!roomCode}
        >
          Next → Add Questions
        </button>

        <br />

        <button
          style={{ marginTop: "15px" }}
          onClick={() => navigate("/dashboard")}
        >
          ← Back to Dashboard
        </button>
      </div>
    </motion.div>
  );
}

export default CreateQuiz;