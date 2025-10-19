#!/bin/bash

echo "🐦 Starting Pigeon EV Charging Platform..."

# Function to cleanup background processes on exit
cleanup() {
    echo "Stopping applications..."
    kill $STREAMLIT_PID $NEXTJS_PID 2>/dev/null
    exit
}

# Set up cleanup on script exit
trap cleanup EXIT INT TERM

# Start Streamlit app
echo "Starting Streamlit app on port 8501..."
cd frontend
streamlit run streamlit_app.py --server.port 8501 --server.headless true &
STREAMLIT_PID=$!

# Start Next.js app
echo "Starting Next.js app on port 3000..."
npm run dev -- --port 3000 &
NEXTJS_PID=$!

# Wait for both apps to start
echo "Waiting for applications to start..."
sleep 5

echo ""
echo "✅ Applications are running!"
echo "🌐 Next.js Dashboard: http://localhost:3000"
echo "🐦 Streamlit Dashboard: http://localhost:8501"
echo ""
echo "Press Ctrl+C to stop both applications"

# Wait for user to stop
wait
