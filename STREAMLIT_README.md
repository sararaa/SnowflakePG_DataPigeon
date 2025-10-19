# Pigeon - EV Charging Platform (Streamlit)

A modern, clean dashboard for EV charging station management built with Streamlit.

## 🚀 Quick Start

1. **Install dependencies**:
```bash
pip install -r requirements.txt
```

2. **Run the app**:
```bash
streamlit run streamlit_app.py
```

3. **Open your browser** to `http://localhost:8501`

## ✨ Features

- 📊 **Real-time Dashboard** - Live metrics and KPIs
- 🔌 **Charger Management** - View all chargers with detailed information
- 📍 **Site Overview** - Multiple charging locations
- 📈 **Interactive Charts** - Status distribution and power capacity charts
- 🔍 **Smart Filtering** - Filter by site and status
- 📱 **Responsive Design** - Works on desktop and mobile
- ⚡ **Fast Performance** - Optimized data loading

## 🎯 Pages

- **Dashboard** - Overview metrics and charts
- **Locations** - Charging site details and charger status
- **Sessions** - Charging session history
- **Tickets** - Maintenance and support tickets
- **Alerts** - System notifications and warnings

## 🛠️ Technology Stack

- **Streamlit** - Web application framework
- **Pandas** - Data manipulation
- **Plotly** - Interactive charts
- **Python 3.8+** - Backend language

## 📁 Project Structure

```
├── streamlit_app.py          # Main Streamlit application
├── requirements.txt          # Python dependencies
├── STREAMLIT_README.md       # This documentation
└── README.md                 # Main project documentation
```

## 🔧 Configuration

The app uses sample data for demonstration. To connect to a real database:

1. Update the `fetch_charger_data()` function in `streamlit_app.py`
2. Add your database connection logic
3. Modify data processing as needed

## 🚀 Deployment

### Streamlit Cloud

1. Push your code to GitHub
2. Connect your repository to Streamlit Cloud
3. Deploy with one click

### Local Production

```bash
streamlit run streamlit_app.py --server.port 8501 --server.address 0.0.0.0
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.