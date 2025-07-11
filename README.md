# 🌟 Starseed — School Management Platform

Welcome to **Starseed**, a modern and interactive school management platform built to streamline student, teacher, and admin experiences. This project is designed with scalability, real-time interactions, and simplicity at its core.

🔗 **Live Demo**: Coming soon  
📁 **Repo**: [Starseed GitHub](https://github.com/Wesley7-debug/starseed.git)

## ✨ Features

### 🔐 Authentication
- **Registration number-based login** (no password required)
- Magic link login support (coming soon)
- Custom authentication flow using **NextAuth.js**

### 👩‍🎓 Student Dashboard
- View assigned courses based on department (Science/Art)
- Switch between up to **7 profiles** instantly (e.g., siblings or multiple accounts)
- View greyed-out courses not assigned to their department
- Interactive and clean UI built with **ShadCN** and **TailwindCSS**

### 👨‍🏫 Teacher Dashboard
- Submit courses for assigned classes
- Select department (Science/Art) per course for SS1–SS3 students
- Manage courses with **Edit (PUT)** and **Remove (DELETE)** functionality
- Dashboard automatically syncs to students’ views

### 🧑‍💼 Admin Panel (Planned)
- Manage users (students/teachers)
- Assign classes and roles
- Full data overview and control

### ⚡ Real-Time Features
- Context-based **profile switching** using `useSession` and React context
- Real-time UI updates on profile addition and switching



## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **MongoDB + Mongoose**
- **NextAuth.js** (custom flow)
- **ShadCN/UI** + **TailwindCSS**
- **React Context API**
- **Zod** for form validation (optional)

---

## 🚀 Getting Started

```bash
git clone https://github.com/Wesley7-debug/starseed.git
cd starseed
npm install
npm run dev
