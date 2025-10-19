# EV Charging Platform - Streamlit Version

This is a Streamlit version of the EV Charging Platform dashboard that connects to your Snowflake database.

## Prerequisites

1. **Python 3.8+** installed on your system
2. **Next.js API running** on `http://localhost:3003` (your existing setup)
3. **Snowflake database** with charger data

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

## Running the Streamlit App

1. **Start your Next.js API first** (in one terminal):
```bash
cd "/Users/bina/Pigeon/EV Charging Platform/EV-Charging-Platform"
npm run dev
```

2. **Start the Streamlit app** (in another terminal):
```bash
cd "/Users/bina/Pigeon/EV Charging Platform/EV-Charging-Platform"
streamlit run streamlit_app.py
```

3. **Open your browser** to `http://localhost:8501`

## Features

- 📊 **Real-time Dashboard** - Live data from your Snowflake database
- 🔌 **Charger Management** - View all 40 chargers with detailed information
- 📍 **Site Overview** - San Francisco Ferry Terminal & Los Angeles Expo Center
- 📈 **Interactive Charts** - Status distribution and power capacity charts
- 🔍 **Filtering** - Filter by site and status
- 📥 **Data Export** - Download charger data as CSV
- ⚡ **Live Updates** - Data refreshes every 5 minutes

## Data Source

The app connects to your existing Next.js API at `http://localhost:3003/api/chargers` which pulls data from your Snowflake database.

## Configuration

- **API URL**: Change `API_BASE_URL` in `streamlit_app.py` if your API runs on a different port
- **Cache TTL**: Currently set to 5 minutes (300 seconds) - adjust `@st.cache_data(ttl=300)` as needed

## Troubleshooting

- **"No charger data available"**: Make sure your Next.js API is running on port 3003
- **Connection errors**: Check that your Snowflake database is accessible
- **Missing dependencies**: Run `pip install -r requirements.txt`

## File Structure

```
├── streamlit_app.py          # Main Streamlit application
├── requirements.txt          # Python dependencies
├── STREAMLIT_README.md       # This file
└── app/                      # Your existing Next.js API
    └── api/
        └── chargers/
            └── route.ts      # API endpoint for charger data
```
