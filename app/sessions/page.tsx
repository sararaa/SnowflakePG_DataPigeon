'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Battery, Clock, Zap, Car } from 'lucide-react';
import { snowflake } from '@/lib/snowflake';

const STATUS_COLORS = {
  Active: 'bg-green-500',
  Completed: 'bg-blue-500',
  Failed: 'bg-red-500',
  Pending: 'bg-yellow-500',
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      // Create sample session data based on charger data
      const response = await fetch('/api/chargers');
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        const chargers = result.data;
        // Create sample sessions
        const sampleSessions = chargers.slice(0, 10).map((charger: any, index: number) => ({
          SESSION_ID: `SES_${index.toString().padStart(6, '0')}`,
          CHARGER_ID: charger.CHARGER_ID,
          VEHICLE_ID: `VEH_${index.toString().padStart(4, '0')}`,
          STATUS: index % 4 === 0 ? 'Active' : index % 4 === 1 ? 'Completed' : index % 4 === 2 ? 'Failed' : 'Pending',
          ENERGY_DELIVERED_KWH: Math.random() * 50 + 10,
          DURATION_MINUTES: Math.floor(Math.random() * 120) + 30,
          START_TIME: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          END_TIME: index % 4 === 0 ? null : new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString(),
          charger: {
            CHARGER_ID: charger.CHARGER_ID
          }
        }));
        setSessions(sampleSessions);
      }
    } catch (error) {
      console.error('Error fetching sessions data:', error);
    }
  };

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'all') return true;
    return session.STATUS === filter;
  });

  const getDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Ongoing';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `${diffMins} min`;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m ago`;
    return `${minutes}m ago`;
  };

  const statusCounts = {
    Active: sessions.filter((s) => s.STATUS === 'Active').length,
    Completed: sessions.filter((s) => s.STATUS === 'Completed').length,
    Failed: sessions.filter((s) => s.STATUS === 'Failed').length,
    Pending: sessions.filter((s) => s.STATUS === 'Pending').length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Charging Sessions</h1>
        <div className="flex gap-2">
          {Object.entries(statusCounts).map(([status, count]) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              onClick={() => setFilter(filter === status ? 'all' : status)}
              className="flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${STATUS_COLORS[status as keyof typeof STATUS_COLORS]}`} />
              {status} ({count})
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.Active}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Energy</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((sum, s) => sum + (s.ENERGY_DELIVERED_KWH || 0), 0).toFixed(1)} kWh
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.length > 0 
                ? Math.round(sessions.reduce((sum, s) => sum + (s.DURATION_MINUTES || 0), 0) / sessions.length)
                : 0} min
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredSessions.map((session) => (
          <Card key={session.SESSION_ID}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">{session.SESSION_ID}</h3>
                    <Badge className={STATUS_COLORS[session.STATUS as keyof typeof STATUS_COLORS]}>
                      {session.STATUS}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>Vehicle: {session.VEHICLE_ID}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Battery className="h-4 w-4" />
                      <span>Energy: {session.ENERGY_DELIVERED_KWH || 0} kWh</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {getDuration(session.START_TIME, session.END_TIME)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      <span>Charger: {session.charger?.CHARGER_ID || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div>Started: {getTimeAgo(session.START_TIME)}</div>
                  {session.END_TIME && (
                    <div>Ended: {getTimeAgo(session.END_TIME)}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
