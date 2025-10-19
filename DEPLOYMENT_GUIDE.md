# EV Charging Platform - Deployment Guide

## 🚀 Deploy to Streamlit Cloud

### Option 1: Direct Snowflake Connection (Recommended for Cloud)

Use `streamlit_direct.py` - this connects directly to Snowflake without needing your local API.

#### 1. Prepare Your Repository

1. **Rename the main file:**
   ```bash
   mv streamlit_direct.py streamlit_app.py
   ```

2. **Set up environment variables in your deployment platform:**
   - `SNOWFLAKE_ACCOUNT` - Your Snowflake account identifier
   - `SNOWFLAKE_USERNAME` - Your Snowflake username
   - `SNOWFLAKE_PASSWORD` - Your Snowflake password
   - `SNOWFLAKE_DATABASE` - Your database name (e.g., SUHANI_OCPP)
   - `SNOWFLAKE_SCHEMA` - Your schema (e.g., PUBLIC)
   - `SNOWFLAKE_WAREHOUSE` - Your warehouse name (e.g., COMPUTE_WH)
   - `SNOWFLAKE_ROLE` - Your role (e.g., ACCOUNTADMIN)

#### 2. Deploy to Streamlit Cloud

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Streamlit app for EV Charging Platform"
   git push origin main
   ```

2. **Deploy on Streamlit Cloud:**
   - Go to [share.streamlit.io](https://share.streamlit.io)
   - Connect your GitHub repository
   - Set the environment variables in the Secrets section
   - Deploy!

### Option 2: Keep Local API (For Local Development)

Use `streamlit_app.py` - this connects to your local Next.js API.

**Note:** This only works when running locally, not in cloud deployments.

## 🔧 Environment Variables Setup

### For Streamlit Cloud:

1. Go to your app's settings
2. Click "Secrets"
3. Add these variables:

```toml
[secrets]
SNOWFLAKE_ACCOUNT = "TFLNRNC-FXB95084"
SNOWFLAKE_USERNAME = "SINAVAGHEFI"
SNOWFLAKE_PASSWORD = "your_password_here"
SNOWFLAKE_DATABASE = "SUHANI_OCPP"
SNOWFLAKE_SCHEMA = "PUBLIC"
SNOWFLAKE_WAREHOUSE = "COMPUTE_WH"
SNOWFLAKE_ROLE = "ACCOUNTADMIN"
```

### For Other Platforms (Heroku, Railway, etc.):

Set these as environment variables in your platform's dashboard:

```bash
SNOWFLAKE_ACCOUNT=TFLNRNC-FXB95084
SNOWFLAKE_USERNAME=SINAVAGHEFI
SNOWFLAKE_PASSWORD=your_password_here
SNOWFLAKE_DATABASE=SUHANI_OCPP
SNOWFLAKE_SCHEMA=PUBLIC
SNOWFLAKE_WAREHOUSE=COMPUTE_WH
SNOWFLAKE_ROLE=ACCOUNTADMIN
```

## 📁 File Structure for Deployment

```
your-repo/
├── streamlit_app.py          # Main app (rename from streamlit_direct.py)
├── requirements.txt          # Python dependencies
├── .streamlit/
│   └── secrets.toml         # Local secrets (optional)
└── README.md                # Your project README
```

## 🛠️ Local Testing

Before deploying, test locally:

```bash
# Install dependencies
pip install -r requirements.txt

# Set environment variables
export SNOWFLAKE_ACCOUNT="TFLNRNC-FXB95084"
export SNOWFLAKE_USERNAME="SINAVAGHEFI"
export SNOWFLAKE_PASSWORD="your_password"
export SNOWFLAKE_DATABASE="SUHANI_OCPP"
export SNOWFLAKE_SCHEMA="PUBLIC"
export SNOWFLAKE_WAREHOUSE="COMPUTE_WH"
export SNOWFLAKE_ROLE="ACCOUNTADMIN"

# Run the app
streamlit run streamlit_app.py
```

## 🔍 Troubleshooting

### Common Issues:

1. **"Missing environment variables"**
   - Make sure all Snowflake credentials are set in your deployment platform

2. **"Failed to connect to Snowflake"**
   - Check your Snowflake credentials
   - Ensure your IP is whitelisted in Snowflake (if required)
   - Verify warehouse and database names

3. **"No charger data available"**
   - Check if the CHARGERS table exists in your database
   - Verify you have the correct schema and database

### Security Notes:

- Never commit your Snowflake password to version control
- Use environment variables for all sensitive data
- Consider using Snowflake key-pair authentication for production

## 🌐 Access Your Deployed App

Once deployed, you'll get a URL like:
- Streamlit Cloud: `https://your-app-name.streamlit.app`
- Heroku: `https://your-app-name.herokuapp.com`
- Railway: `https://your-app-name.railway.app`

## 📊 Features

Your deployed app will include:
- Real-time data from Snowflake
- Interactive charts and metrics
- Filtering by site and status
- Data export functionality
- Responsive design for mobile/desktop
