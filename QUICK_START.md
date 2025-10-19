# 🚀 Quick Start Guide

## Running the Applications

### Option 1: Run Both Apps (Recommended)
```bash
./start_apps.sh
```
This will start both the Next.js and Streamlit applications simultaneously.

### Option 2: Run Individual Apps

#### Streamlit App (Port 8501)
```bash
cd frontend
streamlit run streamlit_app.py
```

#### Next.js App (Port 3000)
```bash
cd frontend
npm run dev
```

## Access the Applications

- **Next.js Dashboard**: http://localhost:3000
- **Streamlit Dashboard**: http://localhost:8501

## Features

Both applications provide:
- 📊 Real-time dashboard with metrics
- 🔌 Charger management
- 📍 Location overview
- 📈 Interactive charts
- 🔍 Smart filtering
- 📱 Responsive design

## Notes

- The applications use sample data (no database connection required)
- Both apps are fully functional and ready to use
- All sensitive data has been removed for public use
