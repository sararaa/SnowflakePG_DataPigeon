'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Activity, CheckCircle, XCircle } from 'lucide-react';
import { supabase, SelfHealingAction, Charger } from '@/lib/supabase';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function SelfHealingPage() {
  const [actions, setActions] = useState<
    (SelfHealingAction & { charger: Charger | null })[]
  >([]);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    const { data } = await supabase
      .from('self_healing_actions')
      .select('*, charger:chargers(*)')
      .order('timestamp', { ascending: false });

    if (data) {
      setActions(data as any);
    }
  };

  const successRate =
    actions.length > 0
      ? ((actions.filter((a) => a.result === 'Success').length / actions.length) *
          100).toFixed(1)
      : 0;

  const pieData = [
    {
      name: 'Success',
      value: actions.filter((a) => a.result === 'Success').length,
      color: '#10b981',
    },
    {
      name: 'Failed',
      value: actions.filter((a) => a.result === 'Failed').length,
      color: '#ef4444',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Self-Healing Actions Log
          </h1>
          <p className="text-muted-foreground">
            Automated recovery actions taken by the system
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-blue-500" />
              <span className="text-3xl font-bold">{actions.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <span className="text-3xl font-bold">{successRate}%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Actions by Result</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={120}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Recent Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Charger</TableHead>
                <TableHead>Issue Detected</TableHead>
                <TableHead>Action Taken</TableHead>
                <TableHead>Result</TableHead>
                <TableHead>Ticket Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell>
                    {new Date(action.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono">
                    {action.charger?.charger_id || 'N/A'}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {action.issue_detected}
                  </TableCell>
                  <TableCell className="max-w-xs">
                    {action.action_taken}
                  </TableCell>
                  <TableCell>
                    {action.result === 'Success' ? (
                      <Badge className="bg-green-500 text-white gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Success
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 text-white gap-1">
                        <XCircle className="h-3 w-3" />
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {action.ticket_id ? (
                      <Badge variant="outline">Yes</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
