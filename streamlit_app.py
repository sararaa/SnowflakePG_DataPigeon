import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import requests
import json
from typing import Dict, List, Any
import os

# Page configuration
st.set_page_config(
    page_title="EV Charging Platform",
    page_icon="⚡",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 3rem;
        font-weight: bold;
        background: linear-gradient(90deg, #3b82f6, #06b6d4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 10px;
        color: white;
        text-align: center;
        margin: 0.5rem 0;
    }
    
    .status-available { color: #10b981; font-weight: bold; }
    .status-charging { color: #3b82f6; font-weight: bold; }
    .status-faulted { color: #ef4444; font-weight: bold; }
    .status-offline { color: #6b7280; font-weight: bold; }
    .status-maintenance { color: #f59e0b; font-weight: bold; }
</style>
""", unsafe_allow_html=True)

# API Configuration
API_BASE_URL = "http://localhost:3003/api"

@st.cache_data(ttl=300)  # Cache for 5 minutes
def fetch_charger_data():
    """Fetch charger data from the API"""
    try:
        response = requests.get(f"{API_BASE_URL}/chargers", timeout=10)
        if response.status_code == 200:
            data = response.json()
            return data.get('data', [])
        else:
            st.error(f"API Error: {response.status_code}")
            return []
    except Exception as e:
        st.error(f"Failed to fetch data: {str(e)}")
        return []

def calculate_metrics(chargers: List[Dict]) -> Dict[str, Any]:
    """Calculate key metrics from charger data"""
    if not chargers:
        return {
            'total_chargers': 0,
            'active_chargers': 0,
            'uptime_percentage': 0,
            'total_power': 0,
            'sites': 0,
            'status_breakdown': {}
        }
    
    total = len(chargers)
    active = len([c for c in chargers if c.get('STATUS_LAST_SEEN') in ['Available', 'Charging']])
    uptime = (active / total * 100) if total > 0 else 0
    total_power = sum(c.get('MAX_POWER_KW', 0) for c in chargers)
    sites = len(set(c.get('SITE_ID', '') for c in chargers))
    
    # Status breakdown
    status_counts = {}
    for charger in chargers:
        status = charger.get('STATUS_LAST_SEEN', 'Unknown')
        status_counts[status] = status_counts.get(status, 0) + 1
    
    return {
        'total_chargers': total,
        'active_chargers': active,
        'uptime_percentage': uptime,
        'total_power': total_power,
        'sites': sites,
        'status_breakdown': status_counts
    }

def create_status_chart(status_breakdown: Dict[str, int]):
    """Create a pie chart for charger status breakdown"""
    if not status_breakdown:
        return None
    
    colors = {
        'Available': '#10b981',
        'Charging': '#3b82f6', 
        'Faulted': '#ef4444',
        'Offline': '#6b7280',
        'Maintenance': '#f59e0b'
    }
    
    fig = go.Figure(data=[go.Pie(
        labels=list(status_breakdown.keys()),
        values=list(status_breakdown.values()),
        marker=dict(colors=[colors.get(label, '#94a3b8') for label in status_breakdown.keys()]),
        textinfo='label+percent+value',
        textfont_size=12
    )])
    
    fig.update_layout(
        title="Charger Status Distribution",
        font=dict(size=12),
        height=400,
        showlegend=True
    )
    
    return fig

def create_power_chart(chargers: List[Dict]):
    """Create a bar chart for power distribution by site"""
    if not chargers:
        return None
    
    # Group by site and calculate total power
    site_power = {}
    for charger in chargers:
        site = charger.get('SITE_ID', 'Unknown')
        power = charger.get('MAX_POWER_KW', 0)
        site_power[site] = site_power.get(site, 0) + power
    
    fig = px.bar(
        x=list(site_power.keys()),
        y=list(site_power.values()),
        title="Total Power Capacity by Site",
        labels={'x': 'Site', 'y': 'Power (kW)'},
        color=list(site_power.values()),
        color_continuous_scale='Blues'
    )
    
    fig.update_layout(height=400, showlegend=False)
    return fig

def main():
    # Header
    st.markdown('<h1 class="main-header">⚡ EV Charging Platform</h1>', unsafe_allow_html=True)
    
    # Fetch data
    with st.spinner('Loading charger data...'):
        chargers = fetch_charger_data()
    
    if not chargers:
        st.error("No charger data available. Please check your API connection.")
        return
    
    # Calculate metrics
    metrics = calculate_metrics(chargers)
    
    # Sidebar
    st.sidebar.title("🔧 Controls")
    st.sidebar.markdown("---")
    
    # Filter options
    site_filter = st.sidebar.selectbox(
        "Filter by Site",
        ["All"] + list(set(c.get('SITE_ID', '') for c in chargers))
    )
    
    status_filter = st.sidebar.selectbox(
        "Filter by Status", 
        ["All"] + list(set(c.get('STATUS_LAST_SEEN', '') for c in chargers))
    )
    
    # Apply filters
    filtered_chargers = chargers.copy()
    if site_filter != "All":
        filtered_chargers = [c for c in filtered_chargers if c.get('SITE_ID') == site_filter]
    if status_filter != "All":
        filtered_chargers = [c for c in filtered_chargers if c.get('STATUS_LAST_SEEN') == status_filter]
    
    # Main dashboard
    st.markdown("## 📊 Dashboard Overview")
    
    # Key metrics
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.metric(
            label="Total Chargers",
            value=metrics['total_chargers'],
            delta=f"{len(filtered_chargers)} filtered"
        )
    
    with col2:
        st.metric(
            label="Active Chargers", 
            value=metrics['active_chargers'],
            delta=f"{metrics['uptime_percentage']:.1f}% uptime"
        )
    
    with col3:
        st.metric(
            label="Total Power",
            value=f"{metrics['total_power']:,} kW",
            delta=f"{metrics['total_power']/1000:.1f} MW"
        )
    
    with col4:
        st.metric(
            label="Active Sites",
            value=metrics['sites'],
            delta="2 locations"
        )
    
    with col5:
        st.metric(
            label="System Health",
            value=f"{metrics['uptime_percentage']:.1f}%",
            delta="Excellent" if metrics['uptime_percentage'] > 90 else "Good" if metrics['uptime_percentage'] > 75 else "Needs Attention"
        )
    
    st.markdown("---")
    
    # Charts section
    col1, col2 = st.columns(2)
    
    with col1:
        # Status distribution chart
        status_chart = create_status_chart(metrics['status_breakdown'])
        if status_chart:
            st.plotly_chart(status_chart, use_container_width=True)
    
    with col2:
        # Power distribution chart
        power_chart = create_power_chart(chargers)
        if power_chart:
            st.plotly_chart(power_chart, use_container_width=True)
    
    # Charger details table
    st.markdown("## 🔌 Charger Details")
    
    if filtered_chargers:
        # Create DataFrame for better display
        df_data = []
        for charger in filtered_chargers:
            df_data.append({
                'Charger ID': charger.get('CHARGER_ID', ''),
                'Site': charger.get('SITE_ID', ''),
                'Model': charger.get('MODEL', ''),
                'Vendor': charger.get('VENDOR', ''),
                'Power (kW)': charger.get('MAX_POWER_KW', 0),
                'Connectors': charger.get('NUM_CONNECTORS', 0),
                'Status': charger.get('STATUS_LAST_SEEN', ''),
                'Firmware': charger.get('FIRMWARE_VERSION', ''),
                'Last Maintenance': charger.get('LAST_MAINTENANCE_DATE', ''),
                'Location': f"{charger.get('LOCATION_LAT', 0):.4f}, {charger.get('LOCATION_LON', 0):.4f}"
            })
        
        df = pd.DataFrame(df_data)
        
        # Style the status column
        def style_status(val):
            if val == 'Available':
                return 'color: #10b981; font-weight: bold'
            elif val == 'Charging':
                return 'color: #3b82f6; font-weight: bold'
            elif val == 'Faulted':
                return 'color: #ef4444; font-weight: bold'
            elif val == 'Offline':
                return 'color: #6b7280; font-weight: bold'
            elif val == 'Maintenance':
                return 'color: #f59e0b; font-weight: bold'
            else:
                return ''
        
        styled_df = df.style.applymap(style_status, subset=['Status'])
        st.dataframe(styled_df, use_container_width=True, height=400)
        
        # Download button
        csv = df.to_csv(index=False)
        st.download_button(
            label="📥 Download Charger Data as CSV",
            data=csv,
            file_name=f"charger_data_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
            mime="text/csv"
        )
    else:
        st.warning("No chargers match the selected filters.")
    
    # Footer
    st.markdown("---")
    st.markdown(
        f"<div style='text-align: center; color: #6b7280;'>"
        f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | "
        f"Data source: Snowflake Database"
        f"</div>", 
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()
