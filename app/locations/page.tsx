'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, BatteryCharging, AlertCircle, Grid, List } from 'lucide-react';
import { snowflake } from '@/lib/snowflake';

export default function LocationsPage() {
  const [sites, setSites] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/chargers');
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        const chargersData = result.data;
        // Group chargers by site
        const siteMap = new Map();
        
        chargersData.forEach((charger: any) => {
          const siteId = charger.SITE_ID;
          if (!siteMap.has(siteId)) {
            siteMap.set(siteId, {
              id: siteId,
              name: siteId === 'STN_SF_FERRY' ? 'San Francisco Ferry Terminal' : 
                    siteId === 'STN_LA_EXPO' ? 'Los Angeles Expo Center' : 
                    `Site ${siteId}`,
              address: siteId === 'STN_SF_FERRY' ? 'San Francisco, CA' : 
                       siteId === 'STN_LA_EXPO' ? 'Los Angeles, CA' : 
                       `Location for ${siteId}`,
              chargers: []
            });
          }
          siteMap.get(siteId).chargers.push(charger);
        });

        setSites(Array.from(siteMap.values()));
      }
    } catch (error) {
      console.error('Error fetching locations data:', error);
    }
  };

  const getLocationStatus = (chargers: any[]) => {
    const critical = chargers.filter((c) => c.STATUS_LAST_SEEN === 'Faulted' || c.STATUS_LAST_SEEN === 'Offline').length;
    const warning = chargers.filter((c) => c.STATUS_LAST_SEEN === 'Maintenance').length;

    if (critical > 0) return { color: 'bg-red-500', label: 'Critical' };
    if (warning > 0) return { color: 'bg-yellow-500', label: 'Warning' };
    return { color: 'bg-green-500', label: 'Healthy' };
  };

  const getStatusCounts = (chargers: any[]) => {
    return {
      active: chargers.filter(
        (c) => c.STATUS_LAST_SEEN === 'Available' || c.STATUS_LAST_SEEN === 'Charging'
      ).length,
      inactive: chargers.filter((c) => c.STATUS_LAST_SEEN === 'Offline').length,
      faulted: chargers.filter((c) => c.STATUS_LAST_SEEN === 'Faulted').length,
    };
  };

  const getAverageUptime = (chargers: any[]) => {
    if (chargers.length === 0) return 0;
    const active = chargers.filter(
      (c) => c.STATUS_LAST_SEEN === 'Available' || c.STATUS_LAST_SEEN === 'Charging'
    ).length;
    return ((active / chargers.length) * 100).toFixed(1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Locations</h1>
          <p className="text-muted-foreground">
            Monitor all charging locations and their health
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Location Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Interactive map showing all locations
              </p>
              <p className="text-sm text-muted-foreground">
                Map integration ready for Mapbox/Leaflet implementation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div
        className={
          viewMode === 'grid'
            ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'
            : 'space-y-4'
        }
      >
        {sites.map((site) => {
          const status = getLocationStatus(site.chargers);
          const counts = getStatusCounts(site.chargers);
          const uptime = getAverageUptime(site.chargers);

          return (
            <Card
              key={site.id}
              className="glassmorphism hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{site.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{site.address}</p>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${status.color}`} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Chargers</span>
                  <span className="font-semibold">{site.chargers.length}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      Active
                    </span>
                    <span className="font-medium">{counts.active}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-gray-500" />
                      Inactive
                    </span>
                    <span className="font-medium">{counts.inactive}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      Faulted
                    </span>
                    <span className="font-medium">{counts.faulted}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Uptime</span>
                    <Badge variant="secondary">{uptime}%</Badge>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/locations/${site.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
