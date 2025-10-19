-- Sample data for existing tables in SUHANI_OCPP.PUBLIC
-- This will populate your existing tables with realistic EV charging data

-- Insert sample data into CHARGERS table
INSERT INTO CHARGERS (CHARGER_ID, SITE_ID, STATUS, HEALTH_STATUS, POWER_OUTPUT_KW, CURRENT_AMPS, VOLTAGE_VOLTS, TEMPERATURE_CELSIUS, UPTIME_PERCENTAGE, CONNECTOR_COUNT, FIRMWARE_VERSION, LAST_MAINTENANCE_DATE, CREATED_AT, UPDATED_AT) VALUES 
('CHG-001', 'SITE-001', 'Available', 'Healthy', 50.0, 32.0, 400.0, 25.5, 98.5, 2, '2.1.0', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('CHG-002', 'SITE-001', 'Charging', 'Warning', 45.0, 28.0, 380.0, 45.2, 95.2, 2, '2.0.5', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('CHG-003', 'SITE-002', 'Faulted', 'Critical', 0.0, 0.0, 0.0, 65.8, 78.3, 2, '1.9.2', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('CHG-004', 'SITE-002', 'Available', 'Healthy', 75.0, 48.0, 500.0, 22.1, 99.1, 2, '2.2.0', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('CHG-005', 'SITE-003', 'Offline', 'Critical', 0.0, 0.0, 0.0, 0.0, 45.2, 2, '1.8.9', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert sample data into SESSIONS table
INSERT INTO SESSIONS (SESSION_ID, CHARGER_ID, VEHICLE_ID, START_TIME, END_TIME, ENERGY_DELIVERED_KWH, DURATION_MINUTES, STATUS, CREATED_AT) VALUES 
('SESS-001', 'CHG-001', 'VEH-001', CURRENT_TIMESTAMP() - INTERVAL '2 hours', CURRENT_TIMESTAMP() - INTERVAL '1 hour', 25.5, 60, 'Completed', CURRENT_TIMESTAMP()),
('SESS-002', 'CHG-002', 'VEH-002', CURRENT_TIMESTAMP() - INTERVAL '30 minutes', NULL, 12.3, 30, 'Active', CURRENT_TIMESTAMP()),
('SESS-003', 'CHG-004', 'VEH-003', CURRENT_TIMESTAMP() - INTERVAL '4 hours', CURRENT_TIMESTAMP() - INTERVAL '3 hours', 45.8, 60, 'Completed', CURRENT_TIMESTAMP()),
('SESS-004', 'CHG-001', 'VEH-004', CURRENT_TIMESTAMP() - INTERVAL '1 day', CURRENT_TIMESTAMP() - INTERVAL '23 hours', 38.2, 45, 'Completed', CURRENT_TIMESTAMP()),
('SESS-005', 'CHG-003', 'VEH-005', CURRENT_TIMESTAMP() - INTERVAL '6 hours', NULL, 0.0, 0, 'Failed', CURRENT_TIMESTAMP());

-- Insert sample data into OCPP_EVENTS table
INSERT INTO OCPP_EVENTS (EVENT_ID, CHARGER_ID, EVENT_TYPE, MESSAGE, TIMESTAMP, STATUS, CREATED_AT) VALUES 
('EVT-001', 'CHG-001', 'StatusNotification', 'Charger available', CURRENT_TIMESTAMP() - INTERVAL '5 minutes', 'Processed', CURRENT_TIMESTAMP()),
('EVT-002', 'CHG-002', 'StartTransaction', 'Charging session started', CURRENT_TIMESTAMP() - INTERVAL '30 minutes', 'Processed', CURRENT_TIMESTAMP()),
('EVT-003', 'CHG-003', 'ErrorCode', 'Ground fault detected', CURRENT_TIMESTAMP() - INTERVAL '2 hours', 'Error', CURRENT_TIMESTAMP()),
('EVT-004', 'CHG-004', 'StatusNotification', 'Charger available', CURRENT_TIMESTAMP() - INTERVAL '10 minutes', 'Processed', CURRENT_TIMESTAMP()),
('EVT-005', 'CHG-005', 'Heartbeat', 'Connection lost', CURRENT_TIMESTAMP() - INTERVAL '1 day', 'Failed', CURRENT_TIMESTAMP());

-- Insert sample data into METER_VALUES table
INSERT INTO METER_VALUES (METER_ID, CHARGER_ID, SESSION_ID, METER_TYPE, VALUE, UNIT, TIMESTAMP, CREATED_AT) VALUES 
('MTR-001', 'CHG-001', 'SESS-001', 'Energy.Active.Import.Register', 25.5, 'kWh', CURRENT_TIMESTAMP() - INTERVAL '1 hour', CURRENT_TIMESTAMP()),
('MTR-002', 'CHG-002', 'SESS-002', 'Power.Active.Import', 45.0, 'kW', CURRENT_TIMESTAMP() - INTERVAL '15 minutes', CURRENT_TIMESTAMP()),
('MTR-003', 'CHG-004', 'SESS-003', 'Energy.Active.Import.Register', 45.8, 'kWh', CURRENT_TIMESTAMP() - INTERVAL '3 hours', CURRENT_TIMESTAMP()),
('MTR-004', 'CHG-001', 'SESS-004', 'Current.Import', 32.0, 'A', CURRENT_TIMESTAMP() - INTERVAL '23 hours', CURRENT_TIMESTAMP()),
('MTR-005', 'CHG-002', 'SESS-002', 'Voltage', 380.0, 'V', CURRENT_TIMESTAMP() - INTERVAL '10 minutes', CURRENT_TIMESTAMP());

-- Insert sample data into ACTIONS table
INSERT INTO ACTIONS (ACTION_ID, CHARGER_ID, ACTION_TYPE, DESCRIPTION, STATUS, CREATED_AT, UPDATED_AT) VALUES 
('ACT-001', 'CHG-003', 'Maintenance', 'Replace faulty ground fault circuit interrupter', 'Pending', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('ACT-002', 'CHG-005', 'Diagnostics', 'Run full system diagnostics', 'In Progress', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('ACT-003', 'CHG-002', 'Firmware Update', 'Update firmware to version 2.2.0', 'Completed', CURRENT_TIMESTAMP() - INTERVAL '1 day', CURRENT_TIMESTAMP()),
('ACT-004', 'CHG-001', 'Inspection', 'Monthly safety inspection', 'Scheduled', CURRENT_TIMESTAMP() + INTERVAL '1 week', CURRENT_TIMESTAMP()),
('ACT-005', 'CHG-004', 'Calibration', 'Calibrate power measurement sensors', 'Pending', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert sample data into PREDICTED_DOWNTIME table
INSERT INTO PREDICTED_DOWNTIME (PREDICTION_ID, CHARGER_ID, PREDICTED_DATE, CONFIDENCE_PERCENTAGE, RISK_LEVEL, REASON, CREATED_AT) VALUES 
('PRED-001', 'CHG-002', CURRENT_TIMESTAMP() + INTERVAL '7 days', 85.5, 'High', 'Temperature sensor showing signs of failure', CURRENT_TIMESTAMP()),
('PRED-002', 'CHG-005', CURRENT_TIMESTAMP() + INTERVAL '30 days', 45.2, 'Low', 'General wear and tear expected', CURRENT_TIMESTAMP()),
('PRED-003', 'CHG-001', CURRENT_TIMESTAMP() + INTERVAL '14 days', 72.3, 'Medium', 'Power supply component aging', CURRENT_TIMESTAMP()),
('PRED-004', 'CHG-004', CURRENT_TIMESTAMP() + INTERVAL '60 days', 25.8, 'Low', 'Minor maintenance needed', CURRENT_TIMESTAMP()),
('PRED-005', 'CHG-003', CURRENT_TIMESTAMP() + INTERVAL '3 days', 95.1, 'Critical', 'Ground fault circuit likely to fail', CURRENT_TIMESTAMP());

-- Insert sample data into DOWNTIME_LABELS table
INSERT INTO DOWNTIME_LABELS (LABEL_ID, CHARGER_ID, LABEL_TYPE, DESCRIPTION, START_TIME, END_TIME, CREATED_AT) VALUES 
('DTL-001', 'CHG-003', 'Maintenance', 'Scheduled maintenance window', CURRENT_TIMESTAMP() + INTERVAL '1 day', CURRENT_TIMESTAMP() + INTERVAL '1 day 4 hours', CURRENT_TIMESTAMP()),
('DTL-002', 'CHG-005', 'Emergency', 'Emergency repair required', CURRENT_TIMESTAMP() - INTERVAL '1 day', NULL, CURRENT_TIMESTAMP()),
('DTL-003', 'CHG-001', 'Planned', 'Firmware update scheduled', CURRENT_TIMESTAMP() + INTERVAL '3 days', CURRENT_TIMESTAMP() + INTERVAL '3 days 2 hours', CURRENT_TIMESTAMP()),
('DTL-004', 'CHG-002', 'Unplanned', 'Unexpected hardware failure', CURRENT_TIMESTAMP() - INTERVAL '6 hours', CURRENT_TIMESTAMP() - INTERVAL '4 hours', CURRENT_TIMESTAMP()),
('DTL-005', 'CHG-004', 'Planned', 'Routine inspection', CURRENT_TIMESTAMP() + INTERVAL '1 week', CURRENT_TIMESTAMP() + INTERVAL '1 week 1 day', CURRENT_TIMESTAMP());

-- Insert sample data into EXTERNAL_CONTEXT table
INSERT INTO EXTERNAL_CONTEXT (CONTEXT_ID, CHARGER_ID, CONTEXT_TYPE, DATA, TIMESTAMP, CREATED_AT) VALUES 
('CTX-001', 'CHG-001', 'Weather', '{"temperature": 22.5, "humidity": 65, "condition": "Clear"}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('CTX-002', 'CHG-002', 'Traffic', '{"density": "High", "peak_hours": true, "congestion_level": 8}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('CTX-003', 'CHG-003', 'Grid', '{"frequency": 50.02, "voltage_stability": "Good", "load_factor": 0.75}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('CTX-004', 'CHG-004', 'Weather', '{"temperature": 18.3, "humidity": 80, "condition": "Cloudy"}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('CTX-005', 'CHG-005', 'Maintenance', '{"last_service": "2024-01-15", "next_service": "2024-04-15", "service_interval": 90}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert sample data into LA_OCPP table
INSERT INTO LA_OCPP (LA_ID, CHARGER_ID, OCPP_VERSION, CONNECTION_STATUS, LAST_HEARTBEAT, CONFIGURATION, CREATED_AT, UPDATED_AT) VALUES 
('LA-001', 'CHG-001', '1.6', 'Connected', CURRENT_TIMESTAMP() - INTERVAL '30 seconds', '{"heartbeat_interval": 300, "meter_value_interval": 60}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('LA-002', 'CHG-002', '1.6', 'Connected', CURRENT_TIMESTAMP() - INTERVAL '45 seconds', '{"heartbeat_interval": 300, "meter_value_interval": 60}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('LA-003', 'CHG-003', '1.6', 'Disconnected', CURRENT_TIMESTAMP() - INTERVAL '2 hours', '{"heartbeat_interval": 300, "meter_value_interval": 60}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('LA-004', 'CHG-004', '2.0', 'Connected', CURRENT_TIMESTAMP() - INTERVAL '15 seconds', '{"heartbeat_interval": 300, "meter_value_interval": 30}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('LA-005', 'CHG-005', '1.6', 'Disconnected', CURRENT_TIMESTAMP() - INTERVAL '1 day', '{"heartbeat_interval": 300, "meter_value_interval": 60}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());

-- Insert sample data into SF_OCPP table
INSERT INTO SF_OCPP (SF_ID, CHARGER_ID, OCPP_VERSION, CONNECTION_STATUS, LAST_HEARTBEAT, CONFIGURATION, CREATED_AT, UPDATED_AT) VALUES 
('SF-001', 'CHG-001', '1.6', 'Connected', CURRENT_TIMESTAMP() - INTERVAL '30 seconds', '{"heartbeat_interval": 300, "meter_value_interval": 60}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('SF-002', 'CHG-002', '1.6', 'Connected', CURRENT_TIMESTAMP() - INTERVAL '45 seconds', '{"heartbeat_interval": 300, "meter_value_interval": 60}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('SF-003', 'CHG-003', '1.6', 'Disconnected', CURRENT_TIMESTAMP() - INTERVAL '2 hours', '{"heartbeat_interval": 300, "meter_value_interval": 60}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('SF-004', 'CHG-004', '2.0', 'Connected', CURRENT_TIMESTAMP() - INTERVAL '15 seconds', '{"heartbeat_interval": 300, "meter_value_interval": 30}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP()),
('SF-005', 'CHG-005', '1.6', 'Disconnected', CURRENT_TIMESTAMP() - INTERVAL '1 day', '{"heartbeat_interval": 300, "meter_value_interval": 60}', CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP());
