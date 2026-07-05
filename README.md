# 🎯 QuizRoom — Gamified Quiz Space with Live Leaderboard

A real-time, Menti-style quiz application where an admin can create quiz rooms and players can join with a room code to compete for the top spot on a live leaderboard.

Built as part of a managerial project to practice full-stack development with **React**, **Node.js/Express**, and **MongoDB**.

---

## ✨ Features

### 🛠️ Admin View
- Create a quiz room and get a unique, shareable room code
- Add unlimited questions, each with 4 options, a correct answer, and custom points
- Live dashboard showing all quizzes, their status, and players as they join in real time
- Start a quiz once players have joined
- View final results/leaderboard after a quiz ends
- Delete quizzes
- Quizzes auto-end once their time runs out — no need to manually stop them

### 🎮 Player View
- Join any quiz instantly using a room code and a display name
- Wait in a lobby until the admin starts the quiz
- Answer timed questions (15s per question) and watch your score update live
- See a **live leaderboard** during the quiz, showing how you rank against everyone else in the room
- View the final leaderboard once the quiz ends for everyone
- Can't rejoin or resubmit answers after completing a quiz — no re-attempts

### 🔒 Access Control
- Only the admin can access the dashboard (create/manage/delete quizzes)
- Players are only ever shown a "Go Home" option after finishing — no dashboard access

---

## 🧰 Tech Stack

**Frontend**
- React (Vite)
- React Router
- Axios
- Framer Motion (animations)

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- CORS, dotenv

---

## 📁 Project Structure

```
├── frontend/
│   └── src/
│       ├── pages/        # Home, JoinQuiz, CreateQuiz, AddQuestions,
│       │                 # WaitingRoom, QuizRoom, Results,
│       │                 # AdminDashboard, ManageQuiz
│       ├── styles/       # Per-page CSS
│       └── App.jsx       # Routes
│
└── backend/
    ├── models/
    │   └── Quiz.js       # Quiz + Player schema
    ├── controllers/
    │   └── quizController.js
    ├── routes/
    │   └── quizRoutes.js
    └── server.js
```

---

## ⚙️ Setup & Installation

### 1. Clone the repo
```bash
git clone <your-repo-url>
cd <repo-folder>
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
MONGO_URI=your_mongodb_connection_string
```

Run the backend:
```bash
node server.js
```
Server runs on `http://localhost:5000`.

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` (default Vite port).

---

## 🔌 API Endpoints

| Method | Endpoint                          | Description                     |
|--------|------------------------------------|----------------------------------|
| POST   | `/api/quizzes`                    | Create a new quiz               |
| GET    | `/api/quizzes`                    | Get all quizzes                 |
| GET    | `/api/quizzes/:id`                | Get a quiz by ID                |
| POST   | `/api/quizzes/:id/questions`      | Add a question to a quiz        |
| POST   | `/api/quizzes/join/:roomCode`     | Join a quiz using room code     |
| PUT    | `/api/quizzes/:id/score`          | Update a player's score         |
| GET    | `/api/quizzes/:id/leaderboard`    | Get sorted leaderboard          |
| PUT    | `/api/quizzes/:id/start`          | Start a quiz                    |
| PUT    | `/api/quizzes/:id/finish`         | Manually end a quiz early       |
| DELETE | `/api/quizzes/:id`                | Delete a quiz                   |

---

## 📌 Known Limitations

- No authentication — the admin dashboard route isn't protected by a login, only by the app's navigation flow
- Player identity is name-based only (no accounts), so duplicate names within a room aren't supported

---

## 👤 Author

**Pavitra**
_Managerial Project #4 — Gamified Quiz Space_
