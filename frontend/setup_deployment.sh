#!/bin/bash

echo "🚀 Setting up EV Charging Platform for deployment..."
echo ""

# Rename the direct connection file to be the main app
echo "📝 Renaming streamlit_direct.py to streamlit_app.py..."
mv streamlit_direct.py streamlit_app.py

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update your Snowflake password in .streamlit/secrets.toml"
echo "2. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Add Streamlit app'"
echo "   git push origin main"
echo ""
echo "3. Deploy to Streamlit Cloud:"
echo "   - Go to https://share.streamlit.io"
echo "   - Connect your GitHub repo"
echo "   - Set environment variables in Secrets"
echo "   - Deploy!"
echo ""
echo "🔑 Required environment variables:"
echo "   SNOWFLAKE_ACCOUNT=TFLNRNC-FXB95084"
echo "   SNOWFLAKE_USERNAME=SINAVAGHEFI"
echo "   SNOWFLAKE_PASSWORD=your_password"
echo "   SNOWFLAKE_DATABASE=SUHANI_OCPP"
echo "   SNOWFLAKE_SCHEMA=PUBLIC"
echo "   SNOWFLAKE_WAREHOUSE=COMPUTE_WH"
echo "   SNOWFLAKE_ROLE=ACCOUNTADMIN"
echo ""
echo "📖 See DEPLOYMENT_GUIDE.md for detailed instructions"
