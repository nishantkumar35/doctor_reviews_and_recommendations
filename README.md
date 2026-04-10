# 👨‍⚕️ Doctor Review & Recommendation System

A robust full-stack platform for doctor reviews, AI-powered search, and personalized health professional recommendations. Built with the **MERN** stack, optimized with **Redis**, and enhanced with **Xenova Transformers** for intelligent classification.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+
- **MongoDB**: Atlas account or local instance
- **Redis**: For caching and session management
- **Cloudinary**: For image storage

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd DoctorReview
   ```

2. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   
   **`backend/.env`**:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   REDIS_URL=your_redis_connection_url
   ```

   **`frontend/.env`**:
   ```env
   VITE_BACKEND_URL=http://localhost:3000/api
   ```

4. **Start Development**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm start

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

---

## ✨ Core Features

### 🔐 Advanced Authentication
- **Dual Flow**: Traditional Email/Password and Google OAuth integration.
- **Secure OTP**: Two-factor verification via Email (Nodemailer).
- **JWT Protection**: Secure cookie-based or header-based authentication.

### 🤖 AI-Powered Search
- **Intelligent Classification**: Leverages `@xenova/transformers` to classify search queries and match them with relevant specialists.
- **Similar Doctors**: Algorithm-driven recommendations for finding alternative specialists.

### 🩺 Doctor Management
- **Professional Profiles**: Detailed portfolios for doctors including specialties, ratings, and reviews.
- **Application Workflow**: Seamless transition from user to doctor profile with specialized application forms.
- **Doctor Dashboard**: Dedicated analytics and review management for medical professionals.

### 💬 Review & Interaction
- **Multi-Level Feedback**: Users can rate and review doctors; doctors can respond to feedback.
- **Review Moderation**: Edit/Delete capabilities for users on their own feedback.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS 4, Framer Motion, Lucide React, Axios |
| **Backend** | Node.js, Express 5, Mongoose, JWT |
| **Storage & Performance** | MongoDB, Redis (Caching/Performance), Cloudinary (Images) |
| **Intelligence** | Xenova Transformers (Transformers.js) |
| **Communication** | Nodemailer (OTP/Notifications) |

---

## 📁 Project Structure

```text
DoctorReview/
├── backend/
│   ├── ai/             # AI Sentiment & Classification (Transformers.js)
│   ├── config/         # DB & Redis connection logic
│   ├── controllers/    # Business logic (Auth, Doctor, Review, Search)
│   ├── middleware/     # Auth (Protect), Role checks, Image processing
│   ├── models/         # Mongoose User, Doctor, and Review schemas
│   ├── route/          # Express API endpoints
│   └── utils/          # Helper functions & Error handlers
└── frontend/
    ├── src/
    │   ├── components/ # Atomic UI & Shared components (Framer Motion)
    │   ├── context/    # Global Auth State Management
    │   ├── pages/      # Views (Dashboards, Search, Profile, Auth)
    │   └── assets/     # Static resources
```

---

## 📝 API Endpoints

### 🔑 Authentication
- `POST /api/auth/register` - New user registration
- `POST /api/auth/login` - Standard login
- `POST /api/auth/google-login` - Google OAuth authentication
- `POST /api/auth/verify-otp` - Email OTP verification

### 👨‍⚕️ Doctors
- `GET /api/doctor/all` - Fetch all doctors
- `GET /api/doctor/:doctorId` - Detailed doctor profile
- `GET /api/doctor/profile` - Current doctor's own profile (Protected)
- `GET /api/doctor/similar/:doctorId` - Find related medical professionals
- `PUT /api/doctor/update` - Update doctor profile (Protected)

### 💬 Reviews
- `GET /api/review/reviews/:doctorId` - Get all reviews for a specific doctor
- `POST /api/review/add` - Submit a new review
- `POST /api/review/reply/add` - Doctor reply to a review
- `DELETE /api/review/delete/:reviewId` - Remove user feedback

---

## 🔐 Security & Optimization
- **Redis Caching**: Optimized query performance for frequently accessed data.
- **Role-Based Access (RBAC)**: Strict permissions for `user` and `doctor` roles.
- **Image Processing**: Multer and Cloudinary integration for secure image uploads.
- **Error Handling**: Centralized global error middleware for consistent API responses.

---

## 👨‍💻 Development
- **Backend Reloading**: Use `nodemon` for automatic server restarts.
- **Frontend Speed**: Powered by **Vite** for near-instant HMR (Hot Module Replacement).
- **Styling**: **Tailwind 4** for high-performance, utility-first design.

---
*Happy coding! 🚀*
