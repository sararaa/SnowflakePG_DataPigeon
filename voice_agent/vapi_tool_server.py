#!/usr/bin/env python3
"""
Vapi Tool Server - Handles custom tool calls from Vapi
"""
from flask import Flask, request, jsonify
import json
import os
from snowflake.core import Root
from snowflake.snowpark import Session

app = Flask(__name__)

# Snowflake connection parameters
CONNECTION_PARAMETERS = {
    "account": "TFLNRNC-FXB95084",
    "user": "ATKSINGH",
    "password": os.environ.get("SNOWFLAKE_PASSWORD"),
    "role": "ACCOUNTADMIN",
    "database": "cortext_search_db",
    "warehouse": "CORTEXT_SEARCH_WH",
    "schema": "PUBLIC",
}

def get_snowflake_session():
    """Get Snowflake session"""
    return Session.builder.configs(CONNECTION_PARAMETERS).create()

@app.route('/tools/get_ev_info', methods=['POST'])
def get_ev_info():
    """
    Custom tool to get electric vehicle information from Snowflake
    """
    try:
        data = request.get_json()
        query = data.get('parameters', {}).get('query', '')
        
        # Connect to Snowflake and search for EV information
        session = get_snowflake_session()
        root = Root(session)
        
        # Replace with your actual service details
        my_service = (
            root.databases["YOUR_DB"]
                .schemas["YOUR_SCHEMA"] 
                .cortex_search_services["YOUR_SERVICE"]
        )
        
        resp = my_service.search(
            query=query,
            columns=["DOCUMENT_CONTENTS", "LIKES"],
            limit=3
        )
        
        # Format response for Vapi
        results = []
        for row in resp.to_pandas().to_dict('records'):
            results.append({
                "content": row.get("DOCUMENT_CONTENTS", ""),
                "relevance": row.get("LIKES", 0)
            })
        
        return jsonify({
            "result": f"Found {len(results)} results for '{query}': " + 
                     " ".join([r["content"][:200] + "..." for r in results[:2]])
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/tools/get_weather', methods=['POST'])
def get_weather():
    """
    Example weather tool
    """
    try:
        data = request.get_json()
        location = data.get('parameters', {}).get('location', '')
        
        # Simulate weather data (replace with actual weather API)
        weather_data = {
            "location": location,
            "temperature": "72°F",
            "condition": "Sunny",
            "humidity": "45%"
        }
        
        return jsonify({
            "result": f"Weather in {location}: {weather_data['temperature']}, {weather_data['condition']}"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    print("Starting Vapi Tool Server...")
    print("Available tools:")
    print("- /tools/get_ev_info - Search for EV information")
    print("- /tools/get_weather - Get weather information")
    print("- /health - Health check")
    
    app.run(host='0.0.0.0', port=3000, debug=True)
