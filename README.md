# CityFix – Smart Civic Complaint Management System

## Overview

CityFix is a full-stack smart civic complaint management platform designed to bridge the communication gap between citizens and municipal authorities.

The platform enables:
- Citizens to report civic issues
- Admins to manage and assign complaints
- Staff members to resolve issues efficiently with proof-based verification

The system focuses on:
- Transparency
- Accountability
- Real-time monitoring
- Smart complaint management
- Geo-based tracking
- Secure workflow management

---

# Features

## Authentication & Authorization

- JWT Authentication
- Role-Based Access Control
- Secure Protected Routes
- Staff Approval System
- Persistent Login using Local Storage

### Roles
- Citizen
- Staff
- Admin

---

# Citizen Dashboard

Citizens can:
- Register/Login
- Report complaints
- Upload complaint images
- Track complaint status
- View live complaint map
- Receive notifications
- Verify completed work
- Reopen unresolved complaints
- View recent complaints

---

# Staff Dashboard

Staff users can:
- View assigned complaints
- Start work on complaints
- Update complaint progress
- Upload before/after proof images
- Add work remarks
- Share GPS location
- View assigned tasks on map
- Manage field workflow

---

# Admin Dashboard

Admins can:
- View all complaints
- Assign complaints to staff
- Approve/reject staff registrations
- Monitor live complaint heatmap
- Manage users
- View analytics and reports
- Monitor suspicious updates
- Create announcements
- Track complaint history

---

# Complaint Workflow

```text
Citizen creates complaint
        ↓
Admin reviews and assigns staff
        ↓
Staff starts work
        ↓
Staff uploads proof and marks completed
        ↓
Citizen/Admin verifies work
        ↓
Complaint resolved
Complaint Status Flow
OPEN
↓
ASSIGNED
↓
IN_PROGRESS
↓
WORK_COMPLETED
↓
VERIFIED
↓
RESOLVED
Security & Verification Features
JWT Authentication
Role-Based Authorization
GPS-Based Verification
Before/After Image Upload
Citizen Verification System
Complaint Audit Trail
Staff Approval System
Suspicious Activity Detection
Live Features
Real-Time Complaint Heatmap
Live Complaint Tracking
Dynamic Dashboard Analytics
Notification System
Real-Time Reports
Tech Stack
Frontend
React.js
React Router DOM
Axios
Tailwind CSS
React Leaflet
Leaflet.js
Backend
Node.js
Express.js
MongoDB
Mongoose
JWT
Multer
Cloudinary
Database
MongoDB Atlas
API Modules
Auth APIs
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
Complaint APIs
POST   /api/complaints
GET    /api/complaints
GET    /api/complaints/my
GET    /api/complaints/:id
PUT    /api/complaints/:id/status
PUT    /api/complaints/:id/assign
PUT    /api/complaints/:id/remarks
GET    /api/complaints/heatmap
Dashboard APIs
GET /api/dashboard/admin
GET /api/dashboard/staff
GET /api/dashboard/citizen
Notification APIs
GET    /api/notifications
PUT    /api/notifications/:id/read
PUT    /api/notifications/read-all
DELETE /api/notifications/:id
Report APIs
GET /api/reports/overview
GET /api/reports/resolution-time
Project Structure
Frontend
cityfix-react/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   ├── hooks/
│   ├── data/
│   └── styles/
Backend
cityfix-backend/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middlewares/
│   ├── services/
│   ├── utils/
│   ├── config/
│   └── uploads/
Setup Instructions
Frontend Setup
cd cityfix-react
npm install
npm run dev
Backend Setup
cd cityfix-backend
npm install
npm run dev
Environment Variables
Backend .env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

FRONTEND_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
Future Implementations
AI & Machine Learning Features
1. ML-Based Complaint Severity Detection

Implement a Machine Learning model to automatically predict complaint severity using:

Complaint text
Uploaded images
Complaint category
Historical complaint data
Location-based urgency

Predicted severity levels:

Low
Medium
High
Critical

This will help:

Prioritize urgent complaints automatically
Reduce manual workload
Improve response time


2. Image-Based Issue Classification

Use Computer Vision models to classify uploaded complaint images into:

Pothole
Garbage
Drainage
Electricity
Water Leakage
Environmental Hazard

This will:

Reduce incorrect categorization
Improve automation
Speed up complaint processing


3. Real-Time WebSocket System

Implement WebSockets for:

Live notifications
Instant dashboard updates
Real-time complaint tracking
Live status synchronization
