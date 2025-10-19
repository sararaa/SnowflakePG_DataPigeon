# 🐦 Pigeon - EV Charging Platform

A comprehensive EV charging station management platform with both Next.js and Streamlit frontends.

## 📁 Project Structure

```
├── frontend/                 # Frontend applications
│   ├── streamlit_app.py     # Streamlit dashboard
│   ├── app/                 # Next.js application
│   ├── components/          # Reusable UI components
│   ├── lib/                 # Utility functions
│   └── requirements.txt     # Python dependencies
├── snowflake/               # Database schema and sample data
│   ├── schema.sql          # Database schema
│   └── sample-data.sql     # Sample data
└── README.md               # This file
```

## 🚀 Quick Start

### Streamlit Version (Recommended)

```bash
cd frontend
pip install -r requirements.txt
streamlit run streamlit_app.py
```

### Next.js Version

```bash
cd frontend
npm install
npm run dev
```

## ✨ Features

- 📊 **Real-time Dashboard** - Live metrics and KPIs
- 🔌 **Charger Management** - View all chargers with detailed information
- 📍 **Site Overview** - Multiple charging locations
- 📈 **Interactive Charts** - Status distribution and power capacity charts
- 🔍 **Smart Filtering** - Filter by site and status
- 📱 **Responsive Design** - Works on desktop and mobile

## 🛠️ Technology Stack

- **Streamlit** - Web application framework
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Pandas** - Data manipulation
- **Plotly** - Interactive charts

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.