import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import os
import time

# Page configuration
st.set_page_config(
    page_title="Pigeon - EV Charging Platform",
    page_icon="🐦",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2rem;
        font-weight: 600;
        color: #1f2937;
        text-align: center;
        margin-bottom: 1rem;
        padding: 0.5rem 0;
    }
    
    .metric-card {
        background: white;
        padding: 1.5rem;
        border-radius: 8px;
        border: 1px solid #e5e7eb;
        text-align: center;
        margin: 0.5rem 0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .status-available { color: #059669; font-weight: 500; }
    .status-charging { color: #2563eb; font-weight: 500; }
    .status-faulted { color: #dc2626; font-weight: 500; }
    .status-offline { color: #6b7280; font-weight: 500; }
    .status-maintenance { color: #d97706; font-weight: 500; }
    
    .nav-button {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 0.5rem 1rem;
        margin: 0.25rem 0;
        width: 100%;
        text-align: left;
        font-weight: 500;
        color: #374151;
        transition: all 0.2s;
    }
    
    .nav-button:hover {
        background: #f9fafb;
        border-color: #d1d5db;
    }
    
    .nav-button.active {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
    }
    
    .section-header {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid #e5e7eb;
    }
    
    .filter-section {
        background: #f9fafb;
        padding: 1rem;
        border-radius: 8px;
        margin: 1rem 0;
        border: 1px solid #e5e7eb;
    }
    
    .stSelectbox > div > div {
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 6px;
    }
    
    .stDataFrame {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
    }
    
    .stRadio > div {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .stRadio > div > label {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 0.75rem 1rem;
        margin: 0;
        font-weight: 500;
        color: #374151;
        transition: all 0.2s;
        cursor: pointer;
    }
    
    .stRadio > div > label:hover {
        background: #f9fafb;
        border-color: #d1d5db;
    }
    
    .stRadio > div > label[data-testid="stRadio"] {
        background: #3b82f6;
        color: white;
        border-color: #3b82f6;
    }
    
    .stRadio > div > label > div {
        color: inherit;
    }
    
    .filter-container {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .filter-title {
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 0.75rem;
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
</style>
""", unsafe_allow_html=True)

# Sample data based on your Snowflake structure
SAMPLE_CHARGERS = [
    {
        'CHARGER_ID': 'STN_SF_FERRY_CHG_01',
        'SITE_ID': 'STN_SF_FERRY',
        'MODEL': 'Terra184',
        'FIRMWARE_VERSION': 'v1.0.4',
        'VENDOR': 'ABB',
        'INSTALL_DATE': '2024-09-01',
        'NETWORK_TYPE': 'LTE',
        'LOCATION_LAT': 37.7957980284918,
        'LOCATION_LON': -122.3937829585807,
        'NUM_CONNECTORS': 2,
        'MAX_POWER_KW': 150,
        'LAST_MAINTENANCE_DATE': '2024-12-05',
        'STATUS_LAST_SEEN': 'Available'
    },
    {
        'CHARGER_ID': 'STN_SF_FERRY_CHG_02',
        'SITE_ID': 'STN_SF_FERRY',
        'MODEL': 'Terra184',
        'FIRMWARE_VERSION': 'v1.0.4',
        'VENDOR': 'ABB',
        'INSTALL_DATE': '2024-09-01',
        'NETWORK_TYPE': 'LTE',
        'LOCATION_LAT': 37.7957980284918,
        'LOCATION_LON': -122.3937829585807,
        'NUM_CONNECTORS': 2,
        'MAX_POWER_KW': 150,
        'LAST_MAINTENANCE_DATE': '2024-12-05',
        'STATUS_LAST_SEEN': 'Charging'
    },
    {
        'CHARGER_ID': 'STN_SF_FERRY_CHG_03',
        'SITE_ID': 'STN_SF_FERRY',
        'MODEL': 'Terra184',
        'FIRMWARE_VERSION': 'v1.0.4',
        'VENDOR': 'ABB',
        'INSTALL_DATE': '2024-09-01',
        'NETWORK_TYPE': 'LTE',
        'LOCATION_LAT': 37.7957980284918,
        'LOCATION_LON': -122.3937829585807,
        'NUM_CONNECTORS': 2,
        'MAX_POWER_KW': 150,
        'LAST_MAINTENANCE_DATE': '2024-12-05',
        'STATUS_LAST_SEEN': 'Faulted'
    },
    {
        'CHARGER_ID': 'STN_LA_EXPO_CHG_01',
        'SITE_ID': 'STN_LA_EXPO',
        'MODEL': 'Terra184',
        'FIRMWARE_VERSION': 'v1.0.4',
        'VENDOR': 'ABB',
        'INSTALL_DATE': '2024-09-01',
        'NETWORK_TYPE': 'LTE',
        'LOCATION_LAT': 34.0522,
        'LOCATION_LON': -118.2437,
        'NUM_CONNECTORS': 2,
        'MAX_POWER_KW': 150,
        'LAST_MAINTENANCE_DATE': '2024-12-05',
        'STATUS_LAST_SEEN': 'Available'
    },
    {
        'CHARGER_ID': 'STN_LA_EXPO_CHG_02',
        'SITE_ID': 'STN_LA_EXPO',
        'MODEL': 'Terra184',
        'FIRMWARE_VERSION': 'v1.0.4',
        'VENDOR': 'ABB',
        'INSTALL_DATE': '2024-09-01',
        'NETWORK_TYPE': 'LTE',
        'LOCATION_LAT': 34.0522,
        'LOCATION_LON': -118.2437,
        'NUM_CONNECTORS': 2,
        'MAX_POWER_KW': 150,
        'LAST_MAINTENANCE_DATE': '2024-12-05',
        'STATUS_LAST_SEEN': 'Maintenance'
    }
]

# Generate more sample data to reach 40 chargers
def generate_sample_chargers():
    chargers = []
    for i in range(40):
        site_id = 'STN_SF_FERRY' if i < 20 else 'STN_LA_EXPO'
        charger_num = (i % 20) + 1
        statuses = ['Available', 'Charging', 'Faulted', 'Offline', 'Maintenance']
        
        charger = {
            'CHARGER_ID': f'{site_id}_CHG_{charger_num:02d}',
            'SITE_ID': site_id,
            'MODEL': 'Terra184',
            'FIRMWARE_VERSION': 'v1.0.4',
            'VENDOR': 'ABB',
            'INSTALL_DATE': '2024-09-01',
            'NETWORK_TYPE': 'LTE',
            'LOCATION_LAT': 37.7957980284918 if site_id == 'STN_SF_FERRY' else 34.0522,
            'LOCATION_LON': -122.3937829585807 if site_id == 'STN_SF_FERRY' else -118.2437,
            'NUM_CONNECTORS': 2,
            'MAX_POWER_KW': 150,
            'LAST_MAINTENANCE_DATE': '2024-12-05',
            'STATUS_LAST_SEEN': statuses[i % len(statuses)]
        }
        chargers.append(charger)
    return chargers

@st.cache_data(ttl=300)
def fetch_charger_data():
    # For now, return sample data
    # In production, this would connect to Snowflake
    return generate_sample_chargers()

def calculate_metrics(chargers):
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

def create_status_chart(status_breakdown):
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

def create_power_chart(chargers):
    if not chargers:
        return None
    
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
    # Fetch data
    with st.spinner('Loading charger data...'):
        chargers = fetch_charger_data()
    
    if not chargers:
        st.error("No charger data available.")
        return
    
    # Calculate metrics
    metrics = calculate_metrics(chargers)
    
    # Sidebar Navigation
    st.sidebar.markdown("## 🐦 Pigeon")
    st.sidebar.markdown("EV Charging Platform")
    st.sidebar.markdown("---")
    
    # Navigation buttons
    pages = ["Dashboard", "Locations", "Sessions", "Tickets", "Alerts"]
    page = st.sidebar.radio("Navigation", pages, index=0)
    
    # Page Content
    if page == "Dashboard":
        # Main dashboard
        st.markdown('<h2 class="section-header">Dashboard Overview</h2>', unsafe_allow_html=True)
        
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
            status_chart = create_status_chart(metrics['status_breakdown'])
            if status_chart:
                st.plotly_chart(status_chart, use_container_width=True)
        
        with col2:
            power_chart = create_power_chart(chargers)
            if power_chart:
                st.plotly_chart(power_chart, use_container_width=True)
    
    elif page == "Locations":
        st.markdown('<h2 class="section-header">Charging Locations</h2>', unsafe_allow_html=True)
        
        # Filters
        st.markdown('<div class="filter-container">', unsafe_allow_html=True)
        st.markdown('<div class="filter-title">Filters</div>', unsafe_allow_html=True)
        col1, col2 = st.columns(2)
        with col1:
            site_filter = st.selectbox(
                "Site",
                ["All"] + list(set(c.get('SITE_ID', '') for c in chargers)),
                key="locations_site"
            )
        with col2:
            status_filter = st.selectbox(
                "Status", 
                ["All"] + list(set(c.get('STATUS_LAST_SEEN', '') for c in chargers)),
                key="locations_status"
            )
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Apply filters
        filtered_chargers = chargers.copy()
        if site_filter != "All":
            filtered_chargers = [c for c in filtered_chargers if c.get('SITE_ID') == site_filter]
        if status_filter != "All":
            filtered_chargers = [c for c in filtered_chargers if c.get('STATUS_LAST_SEEN') == status_filter]
        
        if filtered_chargers:
            # Group chargers by site
            site_map = {}
            for charger in filtered_chargers:
                site_id = charger.get('SITE_ID', 'Unknown')
                if site_id not in site_map:
                    site_map[site_id] = {
                        'id': site_id,
                        'name': site_id.replace('_', ' ').title(),
                        'chargers': []
                    }
                site_map[site_id]['chargers'].append(charger)
            
            # Show site overview
            col1, col2, col3, col4 = st.columns(4)
            with col1:
                st.metric("Total Sites", len(site_map))
            with col2:
                total_chargers = sum(len(site['chargers']) for site in site_map.values())
                st.metric("Total Chargers", total_chargers)
            with col3:
                active_chargers = sum(len([c for c in site['chargers'] if c.get('STATUS_LAST_SEEN') in ['Available', 'Charging']]) for site in site_map.values())
                st.metric("Active Chargers", active_chargers)
            with col4:
                total_power = sum(sum(c.get('MAX_POWER_KW', 0) for c in site['chargers']) for site in site_map.values())
                st.metric("Total Power", f"{total_power} kW")
            
            st.markdown("---")
            
            # Site details
            for site_id, site_data in site_map.items():
                st.markdown(f"### {site_data['name']}")
                
                # Site metrics
                site_chargers = site_data['chargers']
                active = len([c for c in site_chargers if c.get('STATUS_LAST_SEEN') in ['Available', 'Charging']])
                total_power = sum(c.get('MAX_POWER_KW', 0) for c in site_chargers)
                uptime = (active / len(site_chargers) * 100) if site_chargers else 0
                
                col1, col2, col3, col4 = st.columns(4)
                with col1:
                    st.metric("Chargers", len(site_chargers))
                with col2:
                    st.metric("Active", active)
                with col3:
                    st.metric("Uptime", f"{uptime:.1f}%")
                with col4:
                    st.metric("Power", f"{total_power} kW")
                
                # Charger details
                df_data = []
                for charger in site_chargers:
                    status = charger.get('STATUS_LAST_SEEN', '')
                    status_class = f"status-{status.lower()}" if status else ""
                    df_data.append({
                        'Charger ID': charger.get('CHARGER_ID', ''),
                        'Model': charger.get('MODEL', ''),
                        'Power (kW)': charger.get('MAX_POWER_KW', 0),
                        'Status': status,
                        'Firmware': charger.get('FIRMWARE_VERSION', ''),
                    })
                
                if df_data:
                    df = pd.DataFrame(df_data)
                    st.dataframe(df, use_container_width=True)
                
                st.markdown("---")
        else:
            st.warning("No chargers match the selected filters.")
    
    elif page == "Sessions":
        st.markdown('<h2 class="section-header">Charging Sessions</h2>', unsafe_allow_html=True)
        
        # Filters
        st.markdown('<div class="filter-container">', unsafe_allow_html=True)
        st.markdown('<div class="filter-title">Filters</div>', unsafe_allow_html=True)
        col1, col2 = st.columns(2)
        with col1:
            site_filter = st.selectbox(
                "Site",
                ["All"] + list(set(c.get('SITE_ID', '') for c in chargers)),
                key="sessions_site"
            )
        with col2:
            status_filter = st.selectbox(
                "Status", 
                ["All"] + list(set(c.get('STATUS_LAST_SEEN', '') for c in chargers)),
                key="sessions_status"
            )
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Apply filters
        filtered_chargers = chargers.copy()
        if site_filter != "All":
            filtered_chargers = [c for c in filtered_chargers if c.get('SITE_ID') == site_filter]
        if status_filter != "All":
            filtered_chargers = [c for c in filtered_chargers if c.get('STATUS_LAST_SEEN') == status_filter]
        
        # Create sample session data
        sample_sessions = []
        for i, charger in enumerate(filtered_chargers[:10]):
            sample_sessions.append({
                'Session ID': f"SES_{i:06d}",
                'Charger ID': charger.get('CHARGER_ID', ''),
                'Vehicle ID': f"VEH_{i:04d}",
                'Status': ['Active', 'Completed', 'Failed', 'Pending'][i % 4],
                'Energy (kWh)': round(10 + (i * 5.5), 1),
                'Duration (min)': 30 + (i * 15),
                'Start Time': (datetime.now() - timedelta(hours=i*2)).strftime('%Y-%m-%d %H:%M'),
                'End Time': (datetime.now() - timedelta(hours=i*2-1)).strftime('%Y-%m-%d %H:%M') if i % 4 != 0 else 'Ongoing'
            })
        
        if sample_sessions:
            df = pd.DataFrame(sample_sessions)
            st.dataframe(df, use_container_width=True)
        else:
            st.warning("No sessions available.")
    
    elif page == "Tickets":
        st.markdown('<h2 class="section-header">Maintenance Tickets</h2>', unsafe_allow_html=True)
        
        # Filters
        st.markdown('<div class="filter-container">', unsafe_allow_html=True)
        st.markdown('<div class="filter-title">Filters</div>', unsafe_allow_html=True)
        col1, col2 = st.columns(2)
        with col1:
            site_filter = st.selectbox(
                "Site",
                ["All"] + list(set(c.get('SITE_ID', '') for c in chargers)),
                key="tickets_site"
            )
        with col2:
            status_filter = st.selectbox(
                "Status", 
                ["All"] + list(set(c.get('STATUS_LAST_SEEN', '') for c in chargers)),
                key="tickets_status"
            )
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Apply filters
        filtered_chargers = chargers.copy()
        if site_filter != "All":
            filtered_chargers = [c for c in filtered_chargers if c.get('SITE_ID') == site_filter]
        if status_filter != "All":
            filtered_chargers = [c for c in filtered_chargers if c.get('STATUS_LAST_SEEN') == status_filter]
        
        # Create sample ticket data
        sample_tickets = []
        for i, charger in enumerate(filtered_chargers[:8]):
            sample_tickets.append({
                'Ticket ID': f"TKT-{i:06d}",
                'Charger ID': charger.get('CHARGER_ID', ''),
                'Title': ['Firmware Update Required', 'Maintenance Scheduled', 'Performance Check'][i % 3],
                'Priority': ['P1-Critical', 'P2-High', 'P3-Medium', 'P4-Low'][i % 4],
                'Status': ['Open', 'In Progress', 'Resolved', 'Escalated'][i % 4],
                'Assigned To': ['John Smith', 'Jane Doe'][i % 2],
                'Created': (datetime.now() - timedelta(days=i*3)).strftime('%Y-%m-%d'),
                'SLA': '2 days' if i % 4 == 0 else '5 days'
            })
        
        if sample_tickets:
            df = pd.DataFrame(sample_tickets)
            st.dataframe(df, use_container_width=True)
        else:
            st.warning("No tickets available.")
    
    elif page == "Alerts":
        st.markdown('<h2 class="section-header">System Alerts</h2>', unsafe_allow_html=True)
        
        # Filters
        st.markdown('<div class="filter-container">', unsafe_allow_html=True)
        st.markdown('<div class="filter-title">Filters</div>', unsafe_allow_html=True)
        col1, col2 = st.columns(2)
        with col1:
            site_filter = st.selectbox(
                "Site",
                ["All"] + list(set(c.get('SITE_ID', '') for c in chargers)),
                key="alerts_site"
            )
        with col2:
            status_filter = st.selectbox(
                "Status", 
                ["All"] + list(set(c.get('STATUS_LAST_SEEN', '') for c in chargers)),
                key="alerts_status"
            )
        st.markdown('</div>', unsafe_allow_html=True)
        
        # Apply filters
        filtered_chargers = chargers.copy()
        if site_filter != "All":
            filtered_chargers = [c for c in filtered_chargers if c.get('SITE_ID') == site_filter]
        if status_filter != "All":
            filtered_chargers = [c for c in filtered_chargers if c.get('STATUS_LAST_SEEN') == status_filter]
        
        # Create sample alert data
        sample_alerts = []
        for i, charger in enumerate(filtered_chargers[:5]):
            sample_alerts.append({
                'Alert ID': f"ALERT_{i:03d}",
                'Charger ID': charger.get('CHARGER_ID', ''),
                'Severity': ['WARNING', 'INFO', 'ERROR'][i % 3],
                'Message': ['Firmware update available', 'Charger operating normally', 'Maintenance required'][i % 3],
                'Status': 'Unacknowledged' if i % 2 == 0 else 'Acknowledged',
                'Created': (datetime.now() - timedelta(hours=i)).strftime('%Y-%m-%d %H:%M'),
                'Actions': 'Acknowledge' if i % 2 == 0 else 'Resolved'
            })
        
        if sample_alerts:
            df = pd.DataFrame(sample_alerts)
            st.dataframe(df, use_container_width=True)
        else:
            st.warning("No alerts available.")
    
    # Footer
    st.markdown("---")
    st.markdown(
        f"<div style='text-align: center; color: #6b7280; font-size: 0.9rem; padding: 1rem 0;'>"
        f"Last updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')} • "
        f"Total Chargers: {metrics['total_chargers']} • "
        f"Pigeon EV Platform"
        f"</div>", 
        unsafe_allow_html=True
    )

if __name__ == "__main__":
    main()