# 🌌 JIGNASA’S Space – Exclusive Learning Platform for JIGNASA Members

Welcome to **JIGNASA’S Space**, the official members-only platform of **JIGNASA – The Learning Club**, designed to offer personalized learning journeys, resources, and progress tracking.

This is a **single-page application (SPA)** built using **React.js** and **Supabase**, with a clean, responsive black-yellow design theme.

---

## ✨ Key Highlights

- 🔒 **Secure login** using email and password (provided to each member)
- 📱 **Single device login** (only one active session per user)
- 📊 Personalized **progress tracking**
- 🧠 Curated **roadmaps, resources, and project ideas**
- ⚙️ Dynamic dashboard with real-time updates
- 💬 Non-JIGNASA students can **purchase access** via WhatsApp

---

## 🔑 Authentication Flow

### ✅ For JIGNASA Members:
- No registration required.
- Email IDs and passwords are **pre-generated** and shared by the admin.
- Members use those credentials to **log in directly**.

### 💰 For Non-JIGNASA Students:
- Click on **Register Account**
- Shown 3 subscription plans:
  - ₹99 for CSE(DS) non-JIGNASA (RGMCET)
  - ₹249 for other branches (RGMCET)
  - ₹499 for other college students
- Clicking **Buy Now** opens WhatsApp chat with `+91 9490627247` for manual verification and access

---

## 🎨 UI Pages and Components

### 🔐 Login Page
- Fields: Email & Password
- “Register Account” opens the pricing cards
- “Buy Now” opens WhatsApp for manual payment and access

---
  - Creator images
  - Short description of each team member

---

## 🖤 Theme & Design

- **Primary Color**: Black `#000000`
- **Accent Color**: Yellow/Gold `#FFD700`
- Fully responsive for desktop and mobile

---

## ⚙️ Tech Stack

| Tool           | Purpose                             |
|----------------|-------------------------------------|
| React.js (Vite) | Frontend SPA Framework              |
| Supabase       | Backend (Auth, Database, Sessions)  |
| Tailwind CSS   | Styling and layout                  |
| React Router   | Page routing                        |
| Framer Motion  | Progress bar animation              |
| Zustand / Context API | State management (optional)  |

---

## 📁 Folder Structure

```bash
jignasas-space/
├── public/
├── src/
│   ├── assets/             # Icons, images, logos
│   ├── components/         # Navbar, Footer, Cards, ProgressBar
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Explore.jsx
│   │   ├── Dashboard.jsx
│   ├── domains/
│   │   └── FullStack/, DataScience/, etc.
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── RegisterPlans.jsx
│   ├── context/            # AuthContext / ProgressContext
│   └── App.jsx
├── tailwind.config.js
├── vite.config.js
├── .env
├── README.md
└── package.json
