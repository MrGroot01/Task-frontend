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
| **@hello-pangea/dnd** | Maintained fork of react-beautiful-dnd for drag & drop task reordering |
| **react-hot-toast** | Lightweight, beautiful toast notifications with zero config |
| **date-fns** | Lightweight date formatting, tree-shakeable unlike moment.js |
| **CSS Variables** | Design system tokens — dark mode with zero JS, just `data-theme` attribute |
| **Vercel** | Zero-config deployment for Vite apps, instant global CDN |

---

## AI Tools, Libraries & Resources Used

- **Google Gemini 1.5 Flash** — AI task suggestion (via backend, key never exposed to frontend)
- **Groq llama-3.3-70b-versatile** — Faster AI fallback with no daily rate limits
- **@hello-pangea/dnd** — Drag and drop task reordering
- **react-hot-toast** — Toast notification system
- **Django REST Framework Docs** — API design reference
- **MDN Web Docs** — CSS variables and responsive design reference

---

## One Thing I Would Improve With More Time

**Real-time collaboration with WebSockets** — Currently tasks are per-user only. With more time I would add WebSocket support using Django Channels so multiple team members can see task updates live without refreshing the page. I would also add a Kanban board view with column-based drag and drop, email notifications for overdue tasks, and PWA support so users can install the app on mobile like a native application.

---

## Live Demo

- **Frontend:** https://task-frontend-ndgz.vercel.app
- **Backend:** https://taskpro-backend-96wu.onrender.com

## Repositories

- **Frontend:** https://github.com/MrGroot01/Task-frontend
- **Backend:** https://github.com/MrGroot01/Taskpro-backend
