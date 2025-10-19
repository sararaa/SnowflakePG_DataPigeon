'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Copy, Filter, LayoutGrid, List, Plus, Search } from 'lucide-react';
import { snowflake } from '@/lib/snowflake';
import { toast } from 'sonner';

const PRIORITY_COLORS = {
  'P1-Critical': 'bg-red-500',
  'P2-High': 'bg-orange-500',
  'P3-Medium': 'bg-yellow-500',
  'P4-Low': 'bg-blue-500',
};

const STATUS_COLORS = {
  Open: 'bg-blue-500',
  'In Progress': 'bg-yellow-500',
  Resolved: 'bg-green-500',
  Escalated: 'bg-red-500',
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      // Create sample ticket data based on charger data
      const response = await fetch('/api/chargers');
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        const chargers = result.data;
        // Create sample tickets
        const sampleTickets = chargers.slice(0, 8).map((charger: any, index: number) => ({
          id: `ticket_${index}`,
          ticket_id: `TKT-${index.toString().padStart(6, '0')}`,
          charger_id: charger.CHARGER_ID,
          title: index % 3 === 0 ? 'Firmware Update Required' : 
                 index % 3 === 1 ? 'Maintenance Scheduled' : 
                 'Performance Check',
          description: index % 3 === 0 ? 'Charger requires firmware update to latest version' : 
                       index % 3 === 1 ? 'Routine maintenance scheduled for this charger' : 
                       'Performance metrics need review',
          priority: index % 4 === 0 ? 'P1-Critical' : index % 4 === 1 ? 'P2-High' : index % 4 === 2 ? 'P3-Medium' : 'P4-Low',
          status: index % 4 === 0 ? 'Open' : index % 4 === 1 ? 'In Progress' : index % 4 === 2 ? 'Resolved' : 'Escalated',
          assigned_to: index % 2 === 0 ? 'John Smith' : 'Jane Doe',
          sla_breach_at: index % 3 === 0 ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
          created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          charger: {
            charger_id: charger.CHARGER_ID
          }
        }));
        setTickets(sampleTickets);
      }
    } catch (error) {
      console.error('Error fetching tickets data:', error);
    }
  };

  const copyTicketId = (ticketId: string) => {
    navigator.clipboard.writeText(ticketId);
    toast.success('Ticket ID copied to clipboard');
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || ticket.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getSLACountdown = (slaBreachAt: string | null) => {
    if (!slaBreachAt) return 'N/A';
    const now = new Date().getTime();
    const sla = new Date(slaBreachAt).getTime();
    const diff = sla - now;

    if (diff < 0) return 'Breached';

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Manage and track all maintenance tickets
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Ticket
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Escalated">Escalated</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('table')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('kanban')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <Card className="glassmorphism">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Charger ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>SLA Countdown</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono">
                      <div className="flex items-center gap-2">
                        {ticket.ticket_id}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyTicketId(ticket.ticket_id)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">
                      {ticket.charger?.charger_id || 'N/A'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {ticket.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          PRIORITY_COLORS[
                            ticket.priority as keyof typeof PRIORITY_COLORS
                          ]
                        } text-white`}
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          STATUS_COLORS[
                            ticket.status as keyof typeof STATUS_COLORS
                          ]
                        } text-white`}
                      >
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{ticket.assigned_to || 'Unassigned'}</TableCell>
                    <TableCell>
                      <span
                        className={
                          getSLACountdown(ticket.sla_breach_at) === 'Breached'
                            ? 'text-red-500 font-semibold'
                            : ''
                        }
                      >
                        {getSLACountdown(ticket.sla_breach_at)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-4">
          {['Open', 'In Progress', 'Resolved', 'Escalated'].map((status) => (
            <Card key={status} className="glassmorphism">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{status}</span>
                  <Badge variant="secondary">
                    {filteredTickets.filter((t) => t.status === status).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredTickets
                  .filter((t) => t.status === status)
                  .map((ticket) => (
                    <Card key={ticket.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <span className="font-mono text-xs">{ticket.ticket_id}</span>
                          <Badge
                            className={`${
                              PRIORITY_COLORS[
                                ticket.priority as keyof typeof PRIORITY_COLORS
                              ]
                            } text-white text-xs`}
                          >
                            {ticket.priority.split('-')[0]}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium line-clamp-2">
                          {ticket.title}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          {ticket.charger?.charger_id || 'N/A'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          SLA: {getSLACountdown(ticket.sla_breach_at)}
                        </div>
                      </div>
                    </Card>
                  ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
