#!/bin/bash

# EV Charging Platform - Streamlit Launcher
echo "🚀 Starting EV Charging Platform Streamlit App..."
echo ""

# Check if Next.js API is running
echo "🔍 Checking if Next.js API is running..."
if curl -s http://localhost:3003/api/chargers > /dev/null; then
    echo "✅ Next.js API is running on port 3003"
else
    echo "❌ Next.js API is not running!"
    echo "Please start your Next.js API first:"
    echo "  cd \"/Users/bina/Pigeon/EV Charging Platform/EV-Charging-Platform\""
    echo "  npm run dev"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo ""
echo "🌐 Starting Streamlit app..."
echo "The app will open in your browser at: http://localhost:8501"
echo ""

# Run Streamlit
streamlit run streamlit_app.py
