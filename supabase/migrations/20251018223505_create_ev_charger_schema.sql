/*
  # EV Charger Predictive Maintenance Dashboard Schema

  ## Overview
  This migration creates the complete database schema for an EV charger fleet management and predictive maintenance system.

  ## New Tables

  ### 1. regions
  - `id` (uuid, primary key)
  - `name` (text) - Region name
  - `created_at` (timestamptz)

  ### 2. cities
  - `id` (uuid, primary key)
  - `region_id` (uuid, foreign key)
  - `name` (text) - City name
  - `created_at` (timestamptz)

  ### 3. sites
  - `id` (uuid, primary key)
  - `city_id` (uuid, foreign key)
  - `name` (text) - Site name
  - `address` (text)
  - `latitude` (decimal)
  - `longitude` (decimal)
  - `created_at` (timestamptz)

  ### 4. chargers
  - `id` (uuid, primary key)
  - `charger_id` (text, unique) - Human-readable charger identifier
  - `site_id` (uuid, foreign key)
  - `status` (text) - Available/Charging/Faulted/Offline
  - `health_status` (text) - Healthy/Warning/Critical
  - `power_output_kw` (decimal)
  - `current_amps` (decimal)
  - `voltage_volts` (decimal)
  - `temperature_celsius` (decimal)
  - `uptime_percentage` (decimal)
  - `connector_count` (integer)
  - `firmware_version` (text)
  - `last_maintenance_date` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. tickets
  - `id` (uuid, primary key)
  - `ticket_id` (text, unique) - Format: TKT-XXXXXXXX
  - `charger_id` (uuid, foreign key)
  - `title` (text)
  - `description` (text)
  - `priority` (text) - P1-Critical/P2-High/P3-Medium/P4-Low
  - `status` (text) - Open/In Progress/Resolved/Escalated
  - `assigned_to` (text)
  - `sla_breach_at` (timestamptz)
  - `resolved_at` (timestamptz)
  - `resolution_notes` (text)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. alerts
  - `id` (uuid, primary key)
  - `charger_id` (uuid, foreign key)
  - `severity` (text) - INFO/WARNING/ERROR/CRITICAL
  - `message` (text)
  - `acknowledged` (boolean)
  - `created_at` (timestamptz)

  ### 7. telemetry_logs
  - `id` (uuid, primary key)
  - `charger_id` (uuid, foreign key)
  - `session_energy_kwh` (decimal)
  - `power_output_kw` (decimal)
  - `current_amps` (decimal)
  - `voltage_volts` (decimal)
  - `temperature_celsius` (decimal)
  - `timestamp` (timestamptz)

  ### 8. ocpp_logs
  - `id` (uuid, primary key)
  - `charger_id` (uuid, foreign key)
  - `log_type` (text) - INFO/WARNING/ERROR/CRITICAL
  - `ocpp_message` (jsonb) - Raw OCPP message
  - `human_readable` (text) - Translated message
  - `timestamp` (timestamptz)

  ### 9. self_healing_actions
  - `id` (uuid, primary key)
  - `charger_id` (uuid, foreign key)
  - `issue_detected` (text)
  - `action_taken` (text)
  - `result` (text) - Success/Failed
  - `ticket_id` (uuid, foreign key, nullable)
  - `timestamp` (timestamptz)

  ### 10. predictions
  - `id` (uuid, primary key)
  - `charger_id` (uuid, foreign key)
  - `predicted_failure_date` (timestamptz)
  - `confidence_percentage` (decimal)
  - `risk_level` (text) - Low/Medium/High/Critical
  - `recommended_action` (text)
  - `created_at` (timestamptz)

  ### 11. charging_sessions
  - `id` (uuid, primary key)
  - `charger_id` (uuid, foreign key)
  - `energy_delivered_kwh` (decimal)
  - `duration_minutes` (integer)
  - `started_at` (timestamptz)
  - `ended_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Add policies for authenticated access (for demo, allow all authenticated users)

  ## Indexes
  - Add indexes on foreign keys and frequently queried columns
*/

CREATE TABLE IF NOT EXISTS regions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  region_id uuid REFERENCES regions(id) ON DELETE CASCADE,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid REFERENCES cities(id) ON DELETE CASCADE,
  name text NOT NULL,
  address text NOT NULL,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chargers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charger_id text UNIQUE NOT NULL,
  site_id uuid REFERENCES sites(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'Available',
  health_status text NOT NULL DEFAULT 'Healthy',
  power_output_kw decimal(10, 2) DEFAULT 0,
  current_amps decimal(10, 2) DEFAULT 0,
  voltage_volts decimal(10, 2) DEFAULT 0,
  temperature_celsius decimal(5, 2) DEFAULT 0,
  uptime_percentage decimal(5, 2) DEFAULT 100,
  connector_count integer DEFAULT 2,
  firmware_version text DEFAULT '1.0.0',
  last_maintenance_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id text UNIQUE NOT NULL,
  charger_id uuid REFERENCES chargers(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  priority text NOT NULL DEFAULT 'P3-Medium',
  status text NOT NULL DEFAULT 'Open',
  assigned_to text,
  sla_breach_at timestamptz,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charger_id uuid REFERENCES chargers(id) ON DELETE CASCADE,
  severity text NOT NULL DEFAULT 'INFO',
  message text NOT NULL,
  acknowledged boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS telemetry_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charger_id uuid REFERENCES chargers(id) ON DELETE CASCADE,
  session_energy_kwh decimal(10, 2) DEFAULT 0,
  power_output_kw decimal(10, 2) DEFAULT 0,
  current_amps decimal(10, 2) DEFAULT 0,
  voltage_volts decimal(10, 2) DEFAULT 0,
  temperature_celsius decimal(5, 2) DEFAULT 0,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ocpp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charger_id uuid REFERENCES chargers(id) ON DELETE CASCADE,
  log_type text NOT NULL DEFAULT 'INFO',
  ocpp_message jsonb NOT NULL,
  human_readable text,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS self_healing_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charger_id uuid REFERENCES chargers(id) ON DELETE CASCADE,
  issue_detected text NOT NULL,
  action_taken text NOT NULL,
  result text NOT NULL DEFAULT 'Success',
  ticket_id uuid REFERENCES tickets(id) ON DELETE SET NULL,
  timestamp timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charger_id uuid REFERENCES chargers(id) ON DELETE CASCADE,
  predicted_failure_date timestamptz NOT NULL,
  confidence_percentage decimal(5, 2) NOT NULL,
  risk_level text NOT NULL DEFAULT 'Low',
  recommended_action text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS charging_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charger_id uuid REFERENCES chargers(id) ON DELETE CASCADE,
  energy_delivered_kwh decimal(10, 2) DEFAULT 0,
  duration_minutes integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  ended_at timestamptz
);

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

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE chargers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ocpp_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_healing_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE charging_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to regions"
  ON regions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to cities"
  ON cities FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to sites"
  ON sites FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to chargers"
  ON chargers FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to tickets"
  ON tickets FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to alerts"
  ON alerts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to telemetry_logs"
  ON telemetry_logs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to ocpp_logs"
  ON ocpp_logs FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to self_healing_actions"
  ON self_healing_actions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to predictions"
  ON predictions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all access to charging_sessions"
  ON charging_sessions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);