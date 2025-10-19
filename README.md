# 🐦 Pigeon - EV Charging Platform

A modern, clean dashboard for EV charging station management built with Next.js and Streamlit.

## 🚀 Quick Start

### Streamlit Version (Recommended)

```bash
# Install dependencies
pip install -r requirements.txt

# Run the app
streamlit run streamlit_app.py
```

Open your browser to `http://localhost:8501`

### Next.js Version

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open your browser to `http://localhost:3000`

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

### Streamlit Version
- **Streamlit** - Web application framework
- **Pandas** - Data manipulation
- **Plotly** - Interactive charts
- **Python 3.8+** - Backend language

### Next.js Version
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components

## 📁 Project Structure

```
├── streamlit_app.py          # Streamlit application
├── app/                      # Next.js application
│   ├── page.tsx             # Dashboard page
│   ├── locations/           # Locations page
│   ├── sessions/            # Sessions page
│   ├── tickets/             # Tickets page
│   └── alerts/              # Alerts page
├── components/               # Reusable UI components
├── lib/                     # Utility functions
├── requirements.txt         # Python dependencies
└── package.json            # Node.js dependencies
```

## 🔧 Configuration

The app uses sample data for demonstration. To connect to a real database:

1. Update the data fetching functions
2. Add your database connection logic
3. Modify data processing as needed

## 🚀 Deployment

### Streamlit Cloud

1. Push your code to GitHub
2. Connect your repository to Streamlit Cloud
3. Deploy with one click

### Vercel (Next.js)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.