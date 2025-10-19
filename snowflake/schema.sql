-- EV Charger Predictive Maintenance Dashboard Schema for Snowflake
-- Database: SUHANI_OCPP
-- Schema: PUBLIC (or create a custom schema)

-- Create database and schema if they don't exist
CREATE DATABASE IF NOT EXISTS SUHANI_OCPP;
USE DATABASE SUHANI_OCPP;
CREATE SCHEMA IF NOT EXISTS PUBLIC;
USE SCHEMA PUBLIC;

-- 1. regions table
CREATE TABLE IF NOT EXISTS regions (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP()
);

-- 2. cities table
CREATE TABLE IF NOT EXISTS cities (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  region_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

-- 3. sites table
CREATE TABLE IF NOT EXISTS sites (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  city_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 4. chargers table
CREATE TABLE IF NOT EXISTS chargers (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  charger_id VARCHAR(255) UNIQUE NOT NULL,
  site_id VARCHAR(36) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Available',
  health_status VARCHAR(50) NOT NULL DEFAULT 'Healthy',
  power_output_kw DECIMAL(10, 2) DEFAULT 0,
  current_amps DECIMAL(10, 2) DEFAULT 0,
  voltage_volts DECIMAL(10, 2) DEFAULT 0,
  temperature_celsius DECIMAL(5, 2) DEFAULT 0,
  uptime_percentage DECIMAL(5, 2) DEFAULT 100,
  connector_count INTEGER DEFAULT 2,
  firmware_version VARCHAR(50) DEFAULT '1.0.0',
  last_maintenance_date TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (site_id) REFERENCES sites(id) ON DELETE CASCADE
);

-- 5. tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  ticket_id VARCHAR(255) UNIQUE NOT NULL,
  charger_id VARCHAR(36) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  priority VARCHAR(50) NOT NULL DEFAULT 'P3-Medium',
  status VARCHAR(50) NOT NULL DEFAULT 'Open',
  assigned_to VARCHAR(255),
  sla_breach_at TIMESTAMP_TZ,
  resolved_at TIMESTAMP_TZ,
  resolution_notes TEXT,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  updated_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (charger_id) REFERENCES chargers(id) ON DELETE CASCADE
);

-- 6. alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  charger_id VARCHAR(36) NOT NULL,
  severity VARCHAR(50) NOT NULL DEFAULT 'INFO',
  message TEXT NOT NULL,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (charger_id) REFERENCES chargers(id) ON DELETE CASCADE
);

-- 7. telemetry_logs table
CREATE TABLE IF NOT EXISTS telemetry_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  charger_id VARCHAR(36) NOT NULL,
  session_energy_kwh DECIMAL(10, 2) DEFAULT 0,
  power_output_kw DECIMAL(10, 2) DEFAULT 0,
  current_amps DECIMAL(10, 2) DEFAULT 0,
  voltage_volts DECIMAL(10, 2) DEFAULT 0,
  temperature_celsius DECIMAL(5, 2) DEFAULT 0,
  timestamp TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (charger_id) REFERENCES chargers(id) ON DELETE CASCADE
);

-- 8. ocpp_logs table
CREATE TABLE IF NOT EXISTS ocpp_logs (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  charger_id VARCHAR(36) NOT NULL,
  log_type VARCHAR(50) NOT NULL DEFAULT 'INFO',
  ocpp_message VARIANT NOT NULL,
  human_readable TEXT,
  timestamp TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (charger_id) REFERENCES chargers(id) ON DELETE CASCADE
);

-- 9. self_healing_actions table
CREATE TABLE IF NOT EXISTS self_healing_actions (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  charger_id VARCHAR(36) NOT NULL,
  issue_detected TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  result VARCHAR(50) NOT NULL DEFAULT 'Success',
  ticket_id VARCHAR(36),
  timestamp TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (charger_id) REFERENCES chargers(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL
);

-- 10. predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  charger_id VARCHAR(36) NOT NULL,
  predicted_failure_date TIMESTAMP_TZ NOT NULL,
  confidence_percentage DECIMAL(5, 2) NOT NULL,
  risk_level VARCHAR(50) NOT NULL DEFAULT 'Low',
  recommended_action TEXT NOT NULL,
  created_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  FOREIGN KEY (charger_id) REFERENCES chargers(id) ON DELETE CASCADE
);

-- 11. charging_sessions table
CREATE TABLE IF NOT EXISTS charging_sessions (
  id VARCHAR(36) PRIMARY KEY DEFAULT UUID_STRING(),
  charger_id VARCHAR(36) NOT NULL,
  energy_delivered_kwh DECIMAL(10, 2) DEFAULT 0,
  duration_minutes INTEGER DEFAULT 0,
  started_at TIMESTAMP_TZ DEFAULT CURRENT_TIMESTAMP(),
  ended_at TIMESTAMP_TZ,
  FOREIGN KEY (charger_id) REFERENCES chargers(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cities_region ON cities(region_id);
CREATE INDEX IF NOT EXISTS idx_sites_city ON sites(city_id);
CREATE INDEX IF NOT EXISTS idx_chargers_site ON chargers(site_id);
CREATE INDEX IF NOT EXISTS idx_chargers_status ON chargers(status);
CREATE INDEX IF NOT EXISTS idx_chargers_health ON chargers(health_status);
CREATE INDEX IF NOT EXISTS idx_tickets_charger ON tickets(charger_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON tickets(priority);
CREATE INDEX IF NOT EXISTS idx_alerts_charger ON alerts(charger_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_charger_timestamp ON telemetry_logs(charger_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_ocpp_charger_timestamp ON ocpp_logs(charger_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_sessions_charger ON charging_sessions(charger_id);

-- Insert sample data for testing
INSERT INTO regions (id, name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440000', 'North America'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Europe'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Asia Pacific');

INSERT INTO cities (id, region_id, name) VALUES 
  ('650e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 'San Francisco'),
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Los Angeles'),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'London');

INSERT INTO sites (id, city_id, name, address, latitude, longitude) VALUES 
  ('750e8400-e29b-41d4-a716-446655440000', '650e8400-e29b-41d4-a716-446655440000', 'Downtown SF Station', '123 Market St, San Francisco, CA', 37.7749, -122.4194),
  ('750e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'LA Airport Hub', '456 Airport Blvd, Los Angeles, CA', 33.9425, -118.4081);

INSERT INTO chargers (id, charger_id, site_id, status, health_status, power_output_kw, current_amps, voltage_volts, temperature_celsius, uptime_percentage, connector_count, firmware_version) VALUES 
  ('850e8400-e29b-41d4-a716-446655440000', 'CHG-001', '750e8400-e29b-41d4-a716-446655440000', 'Available', 'Healthy', 50.0, 32.0, 400.0, 25.5, 98.5, 2, '2.1.0'),
  ('850e8400-e29b-41d4-a716-446655440001', 'CHG-002', '750e8400-e29b-41d4-a716-446655440000', 'Charging', 'Warning', 45.0, 28.0, 380.0, 45.2, 95.2, 2, '2.0.5'),
  ('850e8400-e29b-41d4-a716-446655440002', 'CHG-003', '750e8400-e29b-41d4-a716-446655440001', 'Faulted', 'Critical', 0.0, 0.0, 0.0, 65.8, 78.3, 2, '1.9.2');

INSERT INTO alerts (id, charger_id, severity, message, acknowledged) VALUES 
  ('950e8400-e29b-41d4-a716-446655440000', '850e8400-e29b-41d4-a716-446655440001', 'WARNING', 'High temperature detected', false),
  ('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440002', 'CRITICAL', 'Charger offline - power supply failure', false);

INSERT INTO tickets (id, ticket_id, charger_id, title, description, priority, status, assigned_to, sla_breach_at) VALUES 
  ('a50e8400-e29b-41d4-a716-446655440000', 'TKT-00000001', '850e8400-e29b-41d4-a716-446655440002', 'Power Supply Failure', 'Charger CHG-003 is completely offline due to power supply failure', 'P1-Critical', 'Open', 'John Smith', DATEADD(hour, 4, CURRENT_TIMESTAMP()));

INSERT INTO predictions (id, charger_id, predicted_failure_date, confidence_percentage, risk_level, recommended_action) VALUES 
  ('b50e8400-e29b-41d4-a716-446655440000', '850e8400-e29b-41d4-a716-446655440001', DATEADD(day, 7, CURRENT_TIMESTAMP()), 85.5, 'High', 'Schedule preventive maintenance for cooling system'),
  ('b50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440000', DATEADD(day, 30, CURRENT_TIMESTAMP()), 45.2, 'Low', 'Monitor performance metrics');
