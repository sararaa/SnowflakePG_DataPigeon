'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, Info, XCircle, Check } from 'lucide-react';
import { snowflake } from '@/lib/snowflake';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SEVERITY_CONFIG = {
  CRITICAL: {
    icon: XCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500',
  },
  ERROR: {
    icon: AlertCircle,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500',
  },
  WARNING: {
    icon: AlertTriangle,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500',
  },
  INFO: {
    icon: Info,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500',
  },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      // For now, create some sample alerts based on charger data
      const response = await fetch('/api/chargers');
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        const chargers = result.data;
        // Create sample alerts based on charger data
        const sampleAlerts = chargers.slice(0, 5).map((charger: any, index: number) => ({
          id: `alert_${index}`,
          charger_id: charger.CHARGER_ID,
          severity: index % 3 === 0 ? 'WARNING' : index % 3 === 1 ? 'INFO' : 'ERROR',
          message: index % 3 === 0 ? 'Firmware update available' : 
                   index % 3 === 1 ? 'Charger operating normally' : 
                   'Maintenance required',
          acknowledged: false,
          created_at: new Date().toISOString(),
          charger: {
            charger_id: charger.CHARGER_ID
          }
        }));
        setAlerts(sampleAlerts);
      }
    } catch (error) {
      console.error('Error fetching alerts data:', error);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    // For now, just mark as acknowledged locally
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    toast.success('Alert acknowledged');
  };

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    if (filter === 'unacknowledged') return !alert.acknowledged;
    return alert.severity === filter;
  });

  const severityCounts = {
    CRITICAL: alerts.filter((a) => a.severity === 'CRITICAL' && !a.acknowledged)
      .length,
    ERROR: alerts.filter((a) => a.severity === 'ERROR' && !a.acknowledged).length,
    WARNING: alerts.filter((a) => a.severity === 'WARNING' && !a.acknowledged)
      .length,
    INFO: alerts.filter((a) => a.severity === 'INFO' && !a.acknowledged).length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alerts & Notifications</h1>
          <p className="text-muted-foreground">
            Real-time alerts for your charging fleet
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {Object.entries(severityCounts).map(([severity, count]) => {
          const config =
            SEVERITY_CONFIG[severity as keyof typeof SEVERITY_CONFIG];
          const Icon = config.icon;
          return (
            <Card key={severity} className="glassmorphism">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">{severity}</p>
                    <p className="text-2xl font-bold">{count}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${config.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'unacknowledged' ? 'default' : 'outline'}
          onClick={() => setFilter('unacknowledged')}
        >
          Unacknowledged
        </Button>
        <Button
          variant={filter === 'CRITICAL' ? 'default' : 'outline'}
          onClick={() => setFilter('CRITICAL')}
        >
          Critical
        </Button>
        <Button
          variant={filter === 'ERROR' ? 'default' : 'outline'}
          onClick={() => setFilter('ERROR')}
        >
          Error
        </Button>
        <Button
          variant={filter === 'WARNING' ? 'default' : 'outline'}
          onClick={() => setFilter('WARNING')}
        >
          Warning
        </Button>
      </div>

      <div className="space-y-3">
        {filteredAlerts.map((alert, index) => {
          const config =
            SEVERITY_CONFIG[alert.severity as keyof typeof SEVERITY_CONFIG];
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`glassmorphism border-l-4 ${config.borderColor} ${
                  alert.acknowledged ? 'opacity-50' : ''
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${config.bgColor}`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{alert.severity}</Badge>
                          {alert.acknowledged && (
                            <Badge variant="secondary" className="gap-1">
                              <Check className="h-3 w-3" />
                              Acknowledged
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium">{alert.message}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Charger: {alert.charger?.charger_id || 'N/A'}</span>
                          <span>
                            {new Date(alert.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
