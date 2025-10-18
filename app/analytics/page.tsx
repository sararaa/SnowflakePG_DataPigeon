'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { supabase } from '@/lib/supabase';
import { TrendingUp, AlertCircle, Clock, Zap } from 'lucide-react';

export default function AnalyticsPage() {
  const [errorData, setErrorData] = useState<any[]>([]);
  const [resolutionData, setResolutionData] = useState<any[]>([]);

  useEffect(() => {
    const errorTypes = [
      { type: 'Connection Timeout', count: 45 },
      { type: 'Overcurrent', count: 32 },
      { type: 'Temperature Alert', count: 28 },
      { type: 'Communication Error', count: 21 },
      { type: 'Hardware Fault', count: 15 },
    ];

    const resolutionTimes = [
      { priority: 'P1-Critical', avgTime: 2.5 },
      { priority: 'P2-High', avgTime: 6.2 },
      { priority: 'P3-Medium', avgTime: 12.5 },
      { priority: 'P4-Low', avgTime: 24.8 },
    ];

    setErrorData(errorTypes);
    setResolutionData(resolutionTimes);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights and performance metrics
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">MTTR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-6 w-6 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">4.2h</div>
                <div className="text-xs text-muted-foreground">
                  Mean Time To Repair
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">MTBF</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-500" />
              <div>
                <div className="text-2xl font-bold">168h</div>
                <div className="text-xs text-muted-foreground">
                  Mean Time Between Failures
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">97.6%</div>
                <div className="text-xs text-muted-foreground">System Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div>
                <div className="text-2xl font-bold">141</div>
                <div className="text-xs text-muted-foreground">Last 7 days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Error Frequency by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={errorData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="type" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Average Resolution Time by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis type="number" label={{ value: 'Hours', position: 'bottom' }} />
                <YAxis dataKey="priority" type="category" />
                <Tooltip />
                <Bar dataKey="avgTime" fill="#06b6d4" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>7-Day Failure Prediction Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['CHG-001', 'CHG-002', 'CHG-003', 'CHG-004', 'CHG-005'].map(
              (charger) => (
                <div key={charger} className="flex items-center gap-2">
                  <span className="w-20 text-sm font-mono">{charger}</span>
                  <div className="flex gap-1 flex-1">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const risk = Math.random();
                      let color = 'bg-green-500/20';
                      if (risk > 0.7) color = 'bg-red-500/50';
                      else if (risk > 0.4) color = 'bg-yellow-500/40';

                      return (
                        <div
                          key={i}
                          className={`h-10 flex-1 rounded ${color} border border-border`}
                        />
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
          <div className="flex items-center gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500/20 border border-border rounded" />
              <span className="text-xs text-muted-foreground">Low Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500/40 border border-border rounded" />
              <span className="text-xs text-muted-foreground">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500/50 border border-border rounded" />
              <span className="text-xs text-muted-foreground">High Risk</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
