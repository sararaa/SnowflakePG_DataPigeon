import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Region = {
  id: string;
  name: string;
  created_at: string;
};

export type City = {
  id: string;
  region_id: string;
  name: string;
  created_at: string;
};

export type Site = {
  id: string;
  city_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  created_at: string;
};

export type Charger = {
  id: string;
  charger_id: string;
  site_id: string;
  status: 'Available' | 'Charging' | 'Faulted' | 'Offline';
  health_status: 'Healthy' | 'Warning' | 'Critical';
  power_output_kw: number;
  current_amps: number;
  voltage_volts: number;
  temperature_celsius: number;
  uptime_percentage: number;
  connector_count: number;
  firmware_version: string;
  last_maintenance_date: string;
  created_at: string;
  updated_at: string;
};

export type Ticket = {
  id: string;
  ticket_id: string;
  charger_id: string;
  title: string;
  description: string;
  priority: 'P1-Critical' | 'P2-High' | 'P3-Medium' | 'P4-Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Escalated';
  assigned_to: string | null;
  sla_breach_at: string | null;
  resolved_at: string | null;
  resolution_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Alert = {
  id: string;
  charger_id: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  acknowledged: boolean;
  created_at: string;
};

export type TelemetryLog = {
  id: string;
  charger_id: string;
  session_energy_kwh: number;
  power_output_kw: number;
  current_amps: number;
  voltage_volts: number;
  temperature_celsius: number;
  timestamp: string;
};

export type OCPPLog = {
  id: string;
  charger_id: string;
  log_type: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  ocpp_message: any;
  human_readable: string | null;
  timestamp: string;
};

export type SelfHealingAction = {
  id: string;
  charger_id: string;
  issue_detected: string;
  action_taken: string;
  result: 'Success' | 'Failed';
  ticket_id: string | null;
  timestamp: string;
};

export type Prediction = {
  id: string;
  charger_id: string;
  predicted_failure_date: string;
  confidence_percentage: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  recommended_action: string;
  created_at: string;
};

export type ChargingSession = {
  id: string;
  charger_id: string;
  energy_delivered_kwh: number;
  duration_minutes: number;
  started_at: string;
  ended_at: string | null;
};
