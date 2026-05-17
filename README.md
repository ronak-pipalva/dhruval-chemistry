# ⚗️ Chemistry Teacher Portfolio - Dhruval M. Talsaniya

A modern, responsive, and interactive portfolio website designed for a Chemistry Educator. Built with React and styled with Tailwind CSS, featuring chemistry-themed animations and an integrated notes management system.

## 🚀 Features

- **Dynamic Hero Section**: Interactive chemistry-themed background with floating molecules, benzene rings, and a typing effect for subjects.
- **Study Notes Manager**: A categorized system for 11th and 12th standard notes (Physical, Organic, Inorganic) with download functionality.
- **Admin Dashboard**: Secure panel to add, edit, or delete study materials.
- **Demo Booking**: Comprehensive enrollment form with automatic WhatsApp message pre-fill for student inquiries.
- **Interactive UI**: Smooth scroll navigation, glassmorphism effects, and scroll progress tracking.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Bundler**: Vite
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router 7
- **State Management**: React Context API with LocalStorage persistence

## 📂 Project Structure

```text
src/
├── admin/              # Admin Login and Dashboard components
├── components/         # Reusable UI sections (Hero, About, Notes, etc.)
├── context/            # NotesContext for global state management
├── data/               # Centralized mock data (teacher details, notes)
├── App.jsx             # Main application entry and routing
└── index.css           # Tailwind configuration and custom animations
```

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd my-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

### 4. Build for production

```bash
npm run build
```

## 🔐 Admin Credentials

To access the notes management system:

- **URL**: `/admin`
- **Email**: `dhruval@gmail.com`
- **Password**: `Admin@123`

## 📸 Media Setup

- Place the teacher's profile photo in `public/photo.jpg`.
- Upload PDF notes to `public/notes/` using the naming convention in `src/data/teacherData.js`.

---

© 2025 Dhruval M. Talsaniya | Chemistry Educator
