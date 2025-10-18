'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Clock,
  TrendingUp,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

const HEALTH_COLORS = {
  Healthy: '#10b981',
  Warning: '#f59e0b',
  Critical: '#ef4444',
};

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalChargers: 0,
    activeChargers: 0,
    uptime: 0,
    mtbf: 0,
    selfHealingRate: 0,
    criticalIssues: 0,
  });

  const [healthData, setHealthData] = useState<any[]>([]);
  const [sessionsData, setSessionsData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const { data: chargers } = await supabase.from('chargers').select('*');

    if (chargers) {
      const total = chargers.length;
      const active = chargers.filter(
        (c) => c.status === 'Available' || c.status === 'Charging'
      ).length;
      const avgUptime =
        chargers.reduce((sum, c) => sum + c.uptime_percentage, 0) / total;

      const healthBreakdown = chargers.reduce((acc: any, c) => {
        acc[c.health_status] = (acc[c.health_status] || 0) + 1;
        return acc;
      }, {});

      const healthChartData = Object.entries(healthBreakdown).map(([name, value]) => ({
        name,
        value,
        color: HEALTH_COLORS[name as keyof typeof HEALTH_COLORS],
      }));

      setStats({
        totalChargers: total,
        activeChargers: active,
        uptime: avgUptime,
        mtbf: 168,
        selfHealingRate: 87.5,
        criticalIssues: healthBreakdown.Critical || 0,
      });

      setHealthData(healthChartData);
    }

    const sessionsChartData = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        sessions: Math.floor(Math.random() * 100) + 50,
        energy: Math.floor(Math.random() * 500) + 200,
      };
    });

    setSessionsData(sessionsChartData);
  };

  const kpiCards = [
    {
      title: 'Total Active Chargers',
      value: `${stats.activeChargers}/${stats.totalChargers}`,
      change: '+2.5%',
      icon: BatteryCharging,
      color: 'text-blue-500',
    },
    {
      title: 'System Uptime',
      value: `${stats.uptime.toFixed(1)}%`,
      change: '+0.3%',
      icon: Activity,
      color: 'text-green-500',
    },
    {
      title: 'MTBF (Hours)',
      value: stats.mtbf,
      change: '+5.2%',
      icon: Clock,
      color: 'text-cyan-500',
    },
    {
      title: 'Self-Healing Rate',
      value: `${stats.selfHealingRate}%`,
      change: '+3.1%',
      icon: Zap,
      color: 'text-yellow-500',
    },
    {
      title: 'Critical Issues',
      value: stats.criticalIssues,
      change: '-15%',
      icon: AlertTriangle,
      color: 'text-red-500',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of your EV charging fleet
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-5"
      >
        {kpiCards.map((kpi) => (
          <motion.div key={kpi.title} variants={itemVariants}>
            <Card className="glassmorphism hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={kpi.change.startsWith('+') ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {kpi.change}
                  </Badge>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Fleet Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Charging Sessions (7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={sessionsData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Energy Delivered (kWh)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sessionsData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="energy" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
