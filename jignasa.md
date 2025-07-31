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

## 🧭 Navbar (Visible After Login)

- **Logo + JIGNASA’S Space**
- Home
- Explore
- My Dashboard

---

## 🏠 1. Home Page

- Centered JIGNASA’S Space logo
- Welcome message with username (e.g., *Welcome, Hameed!*)
- Inspirational message:  
  `"Welcome to the flagship platform that empowers your learning journey!"`
- On scroll: display **domain roadmaps section**

---

## 🔍 2. Explore Page

Grid of clickable domain icons:

- Full Stack Web Development (MERN)
- Data Engineering  
- Data Analyst  
- Data Scientist  
- UI/UX Design  
- Product Manager  
- HR Manager  
- Marketing  
- Freelancing

Each domain click opens 3 tabs:
1. **Roadmaps**
2. **Resources**
3. **Projects**

### 2.1 🛤️ Roadmaps Tab
- Image-based roadmap
- Short description of the role
- List of hiring companies

### 2.2 📚 Resources Tab
- Table format:
  - ✅ Checkmark to mark as done
  - ⭐ Favorite symbol
  - ▶️ YouTube icon to open resource
- Marking updates user’s **progress and dashboard**
- Example columns:  
  `Title | Mark Complete | Favorite | Watch`

### 2.3 💼 Projects Tab
- Same structure as Resources
- Includes **GitHub icon** linking to sample projects

### 🔁 Progress Tracker
- Displayed on top of domain page:  
  `e.g., 12/36 Topics Completed`
- Animated progress bar using **Framer Motion**

---

## 📊 3. My Dashboard Page

- Tracks overall learning stats
- Domain-wise completion
- List of favorites
- Settings button with:
  - Logout
  - Session details

---

## 👣 Footer (on all pages)

- Slider/carousel with:
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
