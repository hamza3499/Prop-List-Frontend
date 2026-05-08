# Prop-List: Premium Real Estate Ecosystem

A high-end, cinematic real estate platform built for speed, aesthetics, and a seamless user experience. This ecosystem consists of three main components: a Cinematic User Frontend, a Data-Driven Admin Dashboard, and a Robust Node.js Backend.

---

## 🌟 Key Features

### 💎 User Frontend (Prop-List-Frontend)
- **Cinematic Experience**: Ultra-smooth page transitions using Framer Motion's `AnimatePresence`.
- **Property Detail Page**: High-impact hero sections with parallax effects, 3D-tilt stat cards, and thumbnail navigation.
- **Dynamic Search & Filters**: Real-time filtering by category (House, Apartment, Plot, Commercial), location, price range, and amenities.
- **Smart Forms**: A multi-step, category-aware "Add Property" flow that only asks for relevant data based on property type.
- **User Profiles**: Manage listings, view performance metrics, and handle account verification.

### 🛠 Admin Dashboard (pro-list-admin-frontend)
- **Centralized Management**: A monolithic, state-based dashboard for managing the entire platform.
- **Analytics Hub**: Visual performance charts using Recharts for property counts, user growth, and traffic.
- **Property Moderation**: View, edit, and delete any property across the platform.
- **User Control**: Manage user roles and verification statuses.

### 🔌 Backend (Prop-list-backend)
- **RESTful API**: Clean, scalable API built with Express.js and MongoDB.
- **JWT Authentication**: Secure user sessions and role-based access control.
- **Image Processing**: Robust handling of property images and user avatars via Multer and local static serving.
- **Smart Schema**: A flexible Mongoose model that supports diverse property categories and specific details.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local or Atlas)
- **npm** (comes with Node.js)

### 2. Backend Setup
```bash
cd Backend/Prop-list-backend
npm install
# Create a .env file with:
# PORT=5001
# MONGO_URI=mongodb://localhost:27017/prop-list
# JWT_SECRET=your_super_secret_key
npm run dev
```

### 3. User Frontend Setup
```bash
cd "MY Projects/Prop-List-Frontend"
npm install
npm run dev
```
- Access at: `http://localhost:5173`

### 4. Admin Dashboard Setup
```bash
cd "MY Projects/pro-list-admin-frontend"
npm install
npm run dev
```
- Access at: `http://localhost:5174`

---

## 📂 Architecture & Tech Stack

### Frontend
- **Framework**: React.js 18 (Vite)
- **Styling**: Tailwind CSS + Custom Glassmorphism
- **Animations**: Framer Motion (GSAP compatible)
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useMemo)

### Backend
- **Server**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JSON Web Tokens (JWT) & Bcrypt
- **File Handling**: Multer (Local Storage)

---

## 🎨 Design Philosophy
The platform is designed to be **Cinematic and Alive**. 
- **Glassmorphism**: Subtle blurs and semi-transparent backgrounds for a premium feel.
- **Micro-interactions**: Hover-induced 3D tilts and smooth scroll-triggered reveals.
- **Dynamic Color Palette**: High-contrast reds and deep blacks (Dark Mode optimized) to emphasize luxury real estate.

---

## 🛠 Troubleshooting
- **White Screen on Load**: Ensure all libraries are installed (`npm install`) and that the Backend is running on port 5001.
- **Images not Showing**: Verify that the `/uploads` folder in the Backend is being served as a static directory.
- **API Connection**: The frontend automatically detects your hostname. Ensure your firewall isn't blocking port 5001.

---

Created with ❤️ by the Prop-List Team.
