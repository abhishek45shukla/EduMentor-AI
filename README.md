# EduMentor AI 🎓

**An Intelligent Personalized Learning Agent — aligned with UN SDG 4 (Quality Education)**

EduMentor AI is a full-stack web app that gives every student a personal AI tutor: it explains
concepts at the student's level, generates quizzes, evaluates performance, tracks progress, and
recommends what to study next — instead of behaving like a generic chatbot.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Tailwind CSS, React Router, Axios, Framer Motion, Lucide Icons |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| AI | Google Gemini API (`gemini-3.5-flash`) |
| Auth | JWT + bcrypt |

---

## Project Structure

```
EduMentor-AI/
├── client/                # React frontend
│   └── src/
│       ├── components/    # Navbar, StatCard, Loader, Toast, ProtectedRoute
│       ├── pages/          # Landing, Login, Register, Dashboard, AITutor, Quiz, Progress, Profile, NotFound
│       ├── hooks/          # useDarkMode, useToast
│       ├── services/       # api.js (Axios instance + endpoints)
│       └── context/        # AuthContext.jsx (session persistence)
├── server/                 # Express backend
│   ├── controllers/        # auth, chat, quiz, progress logic
│   ├── routes/              # route definitions
│   ├── middleware/          # JWT auth guard, error handler
│   ├── models/               # User, Progress, Quiz (Mongoose schemas)
│   ├── config/                # MongoDB connection
│   └── utils/gemini.js        # All Gemini prompt-building & calls
└── README.md
```

---

## Prerequisites

- Node.js v18+
- A MongoDB Atlas cluster (free tier is fine) — [mongodb.com/atlas](https://www.mongodb.com/atlas)
- A Google Gemini API key — [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

---

## Setup Instructions

### 1. Clone / unzip the project and install dependencies

```bash
cd EduMentor-AI/server
npm install

cd ../client
npm install
```

### 2. Configure environment variables

**Backend** — copy `server/.env.example` to `server/.env` and fill in your values:

```bash
cd server
cp .env.example .env
```

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/edumentor
JWT_SECRET=replace_with_a_long_random_secret_string
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy `client/.env.example` to `client/.env`:

```bash
cd ../client
cp .env.example .env
```

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the app locally

In one terminal, start the backend:

```bash
cd server
npm run dev
```

The API will run at `http://localhost:5000`.

In a second terminal, start the frontend:

```bash
cd client
npm run dev
```

The app will run at `http://localhost:5173`.

### 4. Try it out

1. Open `http://localhost:5173` and click **Get Started**.
2. Register a student account (name, email, password, grade, subject).
3. From the Dashboard, click **Learn New Topic** to chat with the AI Tutor.
4. Generate a quiz on any topic you just learned, submit it, and see your score.
5. Check the **Progress** page to see your learning graph update.

---

## API Reference

All routes are prefixed with `/api`. Protected routes require `Authorization: Bearer <token>`.

| Method | Route | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create a student account | No |
| POST | `/auth/login` | Log in and receive a JWT | No |
| GET | `/auth/profile` | Get the logged-in student's profile | Yes |
| PUT | `/auth/profile` | Update profile fields | Yes |
| POST | `/chat` | Send a message to the AI tutor | Yes |
| POST | `/generateQuiz` | Generate a 5-question quiz for a topic | Yes |
| POST | `/submitQuiz` | Submit answers and get scored results | Yes |
| GET | `/progress` | Get completed topics, average score, history | Yes |
| GET | `/recommendation` | Get an AI-generated "Today's Study Plan" | Yes |

---

## Deployment Notes

- **Backend**: deploy to Render, Railway, or Fly.io. Set the same environment variables as
  `server/.env`, and set `CLIENT_URL` to your deployed frontend's URL.
- **Frontend**: deploy to Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's
  `/api` URL as a build-time environment variable.
- **Database**: whitelist your deployment platform's IP (or `0.0.0.0/0` for quick testing) in
  MongoDB Atlas's Network Access settings.

---

## Error Handling & Validation

- All backend routes validate required fields and return consistent
  `{ success: false, message }` JSON on failure.
- A centralized Express error handler (`middleware/errorHandler.js`) catches Mongoose
  validation errors, duplicate-key errors, and invalid ObjectIds.
- The frontend Axios instance auto-attaches the JWT and auto-logs-out on a 401 response.
- Toast notifications surface both success and error states to the student.

---

## SDG 4 Alignment

EduMentor AI is built around the idea that quality education means education that adapts to
the learner — not the other way around. By pairing an AI tutor with quizzes, progress
tracking, and daily recommendations, it aims to give every student, regardless of background,
a private, patient, and personalized teacher.
