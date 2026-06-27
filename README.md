# TaskPro Frontend — React + Vite

AI-powered Task Manager frontend built with React 18, Vite, and Axios.

---

## How to Run Locally

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8000`

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/MrGroot01/Task-frontend.git
cd Task-frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```env
VITE_API_BASE_URL=/api
```

**4. Start dev server**
```bash
npm run dev
```

App runs at: `http://localhost:3001`

> The Vite dev proxy forwards `/api` requests to `http://localhost:8000` automatically — no CORS issues in development.

---

## Tech Stack & Why I Chose It

| Technology | Why |
|------------|-----|
| **React 18** | Component-based UI, hooks make state management clean and readable |
| **Vite** | Extremely fast dev server and build tool, much faster than Create React App |
| **React Router v6** | Industry standard for client-side routing in React |
| **Axios** | Better than fetch — interceptors for JWT auto-refresh, cleaner API calls |
| **@hello-pangea/dnd** | Maintained fork of react-beautiful-dnd for drag and drop task reordering |
| **react-hot-toast** | Lightweight, beautiful toast notifications with zero config |
| **date-fns** | Lightweight date formatting, tree-shakeable unlike moment.js |
| **CSS Variables** | Design system tokens — dark mode with zero JS, just data-theme attribute |
| **Vercel** | Zero-config deployment for Vite apps, instant global CDN |

---

## AI Tools, Libraries & Resources Used

- **Google Gemini 1.5 Flash** — Primary AI model for task suggestions via backend
- **Groq llama-3.3-70b-versatile** — Faster AI fallback with no daily rate limits
- **@hello-pangea/dnd** — Drag and drop task reordering
- **react-hot-toast** — Toast notification system
- **Django REST Framework Docs** — API design reference
- **MDN Web Docs** — CSS variables and responsive design reference

---

## One Thing I Would Improve With More Time

With more time I would add real-time collaboration using WebSockets so multiple team members can see task updates live without refreshing the page. I would also add a Kanban board view with column-based drag and drop, email notifications for overdue tasks, and PWA support so users can install the app on mobile like a native application.

---

## How I Broke Down the Problem

I split the frontend into clear layers from the start:
- **components/** — reusable UI pieces, each with its own JSX and CSS file
- **pages/** — full page views that compose components
- **services/** — all API calls in one place with Axios interceptors
- **context/** — global state for auth and dark mode

I prioritised getting auth and CRUD working first, then added AI suggest, then drag and drop, then dark mode. This way the app was always in a shippable state.

---

## What I Got Stuck On and How I Fixed It

**CORS issue on production** — The frontend deployed on Vercel had preview URLs with random hashes like `task-frontend-ndgz-48x89c1v6.vercel.app` which were being blocked by the backend CORS policy. I fixed it by adding a regex pattern `r"^https://.*\.vercel\.app$"` to allow all Vercel domains instead of hardcoding specific URLs.

**Gemini rate limits** — The free Gemini API kept returning 429 Too Many Requests during testing. I solved this by implementing a fallback system — the backend tries Groq first (faster, more generous free tier) and falls back to Gemini if Groq fails. This made the AI feature reliable.

**node_modules pushed to GitHub** — The first Vercel deploy failed because node_modules was accidentally committed. I fixed it by running `git rm -r --cached node_modules` and adding it to `.gitignore`.

These are real problems I debugged and fixed — not a project that worked perfectly first try.

---

## Live Demo

- **Frontend:** https://task-frontend-ndgz-q7e4x0zds-mrgroot01s-projects.vercel.app/
- **Backend:** https://taskpro-backend-96wu.onrender.com

## Repositories

- **Frontend:** https://github.com/MrGroot01/Task-frontend
- **Backend:** https://github.com/MrGroot01/Taskpro-backend
