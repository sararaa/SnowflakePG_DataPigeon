# Pigeon EV Charging Platform - Streamlit App

A modern, responsive EV charging platform built with Streamlit using sample data.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SinaBetterDay/EV-Charging-Platform.git
   cd EV-Charging-Platform
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the app:**
   ```bash
   streamlit run streamlit_app.py
   ```

4. **Open your browser** to `http://localhost:8501`

## 📊 Features

- **Dashboard**: Overview of charging stations, uptime, and system health
- **Locations**: Detailed view of charging locations and their status
- **Sessions**: Sample charging session data
- **Tickets**: Sample maintenance ticket data
- **Alerts**: Sample system alerts and notifications

## 🗄️ Data

The app uses sample data that simulates a real EV charging platform with:
- 40 charging stations across 2 locations
- Various charger statuses (Available, Charging, Faulted, Offline, Maintenance)
- Sample session data
- Sample maintenance tickets
- Sample system alerts

## 🔧 Configuration

No configuration required! The app works out of the box with sample data.

## 🚀 Deployment

### Streamlit Cloud
1. Push your code to GitHub
2. Connect your repository to Streamlit Cloud
3. Deploy! (No environment variables needed)

### Other Platforms
The app can be deployed to any platform that supports Python and Streamlit:
- Heroku
- Railway
- DigitalOcean App Platform
- AWS/GCP/Azure

## 📱 Mobile Support

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🛠️ Development

### Project Structure
```
├── streamlit_app.py          # Main application
├── requirements.txt          # Python dependencies
└── README.md                # This file
```

### Adding New Features
1. Modify `streamlit_app.py` to add new pages or functionality
2. Update `requirements.txt` if you add new dependencies
3. Test locally before deploying

## 🔒 Security

- No sensitive credentials required
- Safe to make public
- No database connections needed

## 📞 Support

For issues or questions:
1. Check the troubleshooting section below
2. Review the Streamlit documentation

## 🐛 Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Run `pip install -r requirements.txt`
   - Check your Python version (3.8+ required)

2. **"No data available"**
   - The app uses sample data, so this should work out of the box
   - Check the logs for any specific error messages

## 📄 License

This project is open source and available under the MIT License.