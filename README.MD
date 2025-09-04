# 🎥 MERN Screen Recorder App

A full-stack web app built with **MERN + SQL** that records the current browser tab with microphone audio. Users can preview, download, and upload recordings to a backend where metadata is stored in an SQL database.  

---

## 🚀 Features
- **Record Screen + Mic Audio** (max 3 minutes)
- **Start / Stop Controls** with timer
- **Preview Player** after recording
- **Download Recording** (`.webm`)
- **Upload to Backend**
- **List Uploaded Recordings** with title, size, date
- **Play recordings inline**

---

## 🛠 Tech Stack
- **Frontend** → React, Axios, Tailwind (optional styling)  
- **Backend** → Node.js, Express, Multer  
- **Database** → SQLite (can be replaced with PostgreSQL/MySQL)  
- **Deployment** → Frontend (Vercel/Netlify), Backend (Render)  

---

## 📂 Project Structure
mern-screen-recorder/
│-- frontend/ # React app
│ └── src/
│ └── App.jsx # Main UI
│
│-- backend/ # Express + SQLite
│ ├── server.js # API + DB logic
│ ├── database.db # SQLite database
│ └── uploads/ # Uploaded recordings
│
└── README.md # Project docs

yaml
Copy code

---

## ⚙️ Setup Instructions (Local Development)

### 1️⃣ Clone the repository
```sh
git clone https://github.com/your-username/mern-screen-recorder.git
cd mern-screen-recorder
2️⃣ Backend Setup
sh
Copy code
cd backend
npm install
npm start
Runs on → http://localhost:5000

3️⃣ Frontend Setup
sh
Copy code
cd ../frontend
npm install
npm start
Runs on → http://localhost:3000

🌐 API Endpoints
POST /api/recordings → Upload recording

GET /api/recordings → Get all recordings

GET /api/recordings/:id → Stream a recording

🚀 Deployment Guide
Frontend → Deploy to Vercel or Netlify

Backend → Deploy to Render

Update API_URL in App.jsx to your deployed backend URL

Example:

js
Copy code
const API_URL = "https://mern-recorder.onrender.com/api/recordings";
📌 Known Limitations
Files are stored locally (/uploads), not cloud storage.

Free Render plan may reset storage on restart → Use AWS S3 or Cloudinary in production.

✨ Learnings
Hands-on with MediaRecorder API

File uploads with Multer

SQL integration in a MERN-style app

Deployment workflow with GitHub + Vercel + Render

🏷 Hashtags for LinkedIn
#PlacementPrep2025 #NxtWave #MERN #React #NodeJS #FullStackDevelopment