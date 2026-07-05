import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import "./App.css";

import Home from "./pages/Home";
import CreateQuiz from "./pages/CreateQuiz";
import AdminDashboard from "./pages/AdminDashboard";
import AddQuestions from "./pages/AddQuestions";
import ManageQuiz from "./pages/ManageQuiz";
import JoinQuiz from "./pages/JoinQuiz";
import WaitingRoom from "./pages/WaitingRoom";
import QuizRoom from "./pages/QuizRoom";
import Results from "./pages/Results";

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Admin */}
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/createquiz" element={<CreateQuiz />} />
        <Route path="/addquestions" element={<AddQuestions />} />
        <Route path="/managequiz/:id" element={<ManageQuiz />} />
        <Route path="/results/:id" element={<Results />} />

        {/* Player */}
        <Route path="/joinquiz" element={<JoinQuiz />} />
        <Route path="/waitingroom" element={<WaitingRoom />} />
        <Route path="/quizroom" element={<QuizRoom />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;