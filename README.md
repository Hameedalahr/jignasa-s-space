# 🌌 JIGNASA's Space

Exclusive Learning Platform for JIGNASA Members

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd jignasas-space
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp env.example .env
# Edit .env with your Supabase credentials
```

4. Start the development server
```bash
npm run dev
```

## 🛠️ Tech Stack

- **Frontend**: React.js with Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Routing**: React Router DOM

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components (Navbar, Footer)
│   └── ui/           # Reusable UI components
├── pages/            # Main application pages
├── domains/          # Domain-specific content
├── auth/             # Authentication logic
├── context/          # React contexts
└── assets/           # Images, icons, etc.
```

## 🎨 Theme

- **Primary Color**: Black (#000000)
- **Accent Color**: Yellow/Gold (#FFD700)
- **Design**: Dark theme with yellow accents

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Environment Variables

Create a `.env` file in the root directory with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_WHATSAPP_NUMBER=+919490627247
```

## 🤝 Contributing

1. Follow the development plan in `development-plan.md`
2. Use conventional commits
3. Test your changes before submitting

## 📄 License

This project is proprietary to JIGNASA - The Learning Club.
