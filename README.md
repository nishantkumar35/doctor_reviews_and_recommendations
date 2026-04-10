# Doctor Review Management System
A comprehensive full-stack platform for doctor reviews, appointments, and health recommendations built with MERN stack.

🚀 Quick Start
Prerequisites
Node.js (v14+)
MongoDB Atlas account (or local MongoDB)
npm or yarn
Installation
Install Dependencies
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
Environment Setup
The .env files are already configured! If you need to recreate them:

backend/.env:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
REDIS_URL=your_redis_url

frontend/.env:

VITE_BACKEND_URL=http://localhost:3000/api
Start the Application
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
Access the Application
Frontend: http://localhost:5173
Backend API: http://localhost:3000/api
🌱 Seed Database (Optional)
To populate with demo data:

cd backend
# Note: Ensure seed.js exists in the backend directory
node seed.js
Demo Credentials:

Admin: admin@demo.com / admin123
Doctor: doctor@demo.com / doctor123
Patient: patient@demo.com / patient123
✨ Features
✅ User Authentication & Authorization (JWT)
✅ Doctor Registration & Verification
✅ Appointment Booking System
✅ Review & Rating System
✅ UPI QR Code Payment Integration
✅ 2-Step Payment & Appointment Approval
✅ Detailed Digital Booking Receipts
✅ Email Notifications
✅ Favorites/Wishlist
✅ Admin Dashboard
✅ Analytics & Reports
✅ AI Health Assistant
✅ Advanced Search & Filtering
✅ Dark Mode Support
🛠️ Technology Stack
Frontend
React (Vite)
Tailwind CSS
Shadcn/UI Components
React Router
Axios
Lucide React Icons
Backend
Node.js & Express
MongoDB & Mongoose
JWT Authentication
Cloudinary (Image Uploads)
Nodemailers (Email)
📁 Project Structure
DoctorReview/
├── backend/              # Backend
│   ├── .env            # Environment variables
│   ├── models/          # Database models
│   ├── route/           # API routes
│   ├── controllers/    # Business logic
│   └── utils/           # Utilities
│
└── frontend/              # Frontend
    ├── .env            # Environment variables
    ├── src/
    │   ├── pages/      # Page components
    │   ├── components/ # Reusable components
    │   └── context/    # React contexts
🔐 Security
All .env files are in .gitignore
JWT tokens stored in HttpOnly cookies
Password hashing with bcryptjs
CORS configured for security
📝 API Endpoints
Authentication
POST /api/auth/register - Register user
POST /api/auth/login - Login
POST /api/auth/logout - Logout
GET /api/auth/me - Get current user
Doctors
GET /api/doctors - Get all doctors (with filters)
GET /api/doctors/:id - Get doctor details
POST /api/doctors - Create doctor profile
PATCH /api/doctors - Update doctor profile
Appointments
GET /api/appointments - Get user appointments
POST /api/appointments - Book appointment
PATCH /api/appointments/:id - Update appointment
PATCH /api/appointments/:id/reschedule - Reschedule
Reviews
GET /api/reviews/doctor/:id - Get doctor reviews
POST /api/reviews - Add review
POST /api/reviews/:reviewId/reply - Reply to review
Payments
POST /api/payments/upi/get-details - Get UPI payment details
POST /api/payments/upi/confirm - Confirm UPI payment
GET /api/payments/history - Get payment history
🆘 Troubleshooting
MongoDB Connection Error
Check internet connection
Verify MongoDB Atlas IP whitelist
Check connection string in backend/.env
Port Already in Use
Change PORT in backend/.env
Or kill process using port 3000/5173
Email Not Sending
Verify Email credentials in backend/.env
Check if App Password is correct
📚 Documentation
START_HERE.md - Detailed quick start guide
SECURE_CREDENTIALS.txt - Backup of credentials (keep secure!)
📄 License
This project is for educational purposes.

👨💻 Development
For development with auto-reload:

# Backend
cd backend
npm run dev  # Uses nodemon

# Frontend
cd frontend
npm run dev  # Vite dev server
Happy coding! 🚀
