import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/AddQuestions.css";

function AddQuestions() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const quiz = state?.quiz;

  const [question, setQuestion] = useState("");
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [points, setPoints] = useState(10);
  const [questionCount, setQuestionCount] = useState(0);

  if (!quiz) {
    return (
      <div className="addq-empty">
        <h2>No Quiz Found!</h2>

        <button onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const addQuestion = async () => {
    if (
      !question ||
      !option1 ||
      !option2 ||
      !option3 ||
      !option4
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/quizzes/${quiz._id}/questions`,
        {
          question,
          options: [option1, option2, option3, option4],
          correctAnswer: Number(correctAnswer),
          points: Number(points),
        }
      );

      setQuestionCount((prev) => prev + 1);

      alert(`✅ Question ${questionCount + 1} Added Successfully!`);

      setQuestion("");
      setOption1("");
      setOption2("");
      setOption3("");
      setOption4("");
      setCorrectAnswer(0);
      setPoints(10);

    } catch (err) {
      console.log(err);
      alert("Error adding question");
    }
  };

  const finishSetup = () => {
    if (questionCount === 0) {
      const confirmFinish = window.confirm(
        "You haven't added any questions. Finish anyway?"
      );

      if (!confirmFinish) return;
    }

    navigate(`/managequiz/${quiz._id}`);
  };

  const copyRoomCode = () => {
    navigator.clipboard.writeText(quiz.roomCode);
    alert("Room Code Copied!");
  };

  return (
    <div className="addq-page">
      <div className="addq-card">
        <h1>{quiz.title}</h1>

        <h3>
          Room Code:
          <span className="addq-room-code">
            {" "}
            {quiz.roomCode}
          </span>
        </h3>

        <button
          className="addq-copy-btn"
          onClick={copyRoomCode}
        >
          📋 Copy Room Code
        </button>

        <h3 className="addq-count">
          Questions Added: {questionCount}
        </h3>

        <hr className="addq-divider" />

        <input
          placeholder="Question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <input
          placeholder="Option 1"
          value={option1}
          onChange={(e) => setOption1(e.target.value)}
        />

        <input
          placeholder="Option 2"
          value={option2}
          onChange={(e) => setOption2(e.target.value)}
        />

        <input
          placeholder="Option 3"
          value={option3}
          onChange={(e) => setOption3(e.target.value)}
        />

        <input
          placeholder="Option 4"
          value={option4}
          onChange={(e) => setOption4(e.target.value)}
        />

        <label className="addq-label">
          Correct Answer
        </label>

        <select
          value={correctAnswer}
          onChange={(e) =>
            setCorrectAnswer(Number(e.target.value))
          }
        >
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
          <option value={3}>Option 4</option>
        </select>

        <label className="addq-label">
          Points
        </label>

        <input
          type="number"
          min="1"
          value={points}
          onChange={(e) =>
            setPoints(Number(e.target.value))
          }
        />

        <div className="addq-actions">
          <button
            className="addq-btn-add"
            onClick={addQuestion}
          >
            ➕ Add Question
          </button>

          <button
            className="addq-btn-finish"
            onClick={finishSetup}
          >
            ✅ Finish Quiz Setup
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddQuestions;