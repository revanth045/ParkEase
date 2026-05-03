import React, { useState } from "react";
import { useListSpots } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Zap, Info, MapPin } from "lucide-react";
import { ParkingSpotSpotType } from "@workspace/api-client-react/src/generated/api.schemas";

export default function Spots() {
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const { data: spots, isLoading } = useListSpots();

  const filteredSpots = spots?.filter(spot => {
    if (zoneFilter !== "all" && spot.zone !== zoneFilter) return false;
    if (typeFilter !== "all" && spot.spotType !== typeFilter) return false;
    return true;
  });

  const getSpotIcon = (type: string) => {
    switch (type) {
      case "ev": return <Zap className="h-5 w-5 text-green-500" />;
      case "handicap": return <Info className="h-5 w-5 text-blue-500" />;
      case "premium": return <Car className="h-5 w-5 text-amber-500" />;
      default: return <Car className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parking Spots</h1>
            <p className="text-muted-foreground">Manage and view status of all parking inventory.</p>
          </div>
        </div>

        <div className="flex gap-4 items-center bg-card p-4 rounded-lg border border-border">
          <div className="w-[200px]">
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Zones" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                <SelectItem value="A">Zone A</SelectItem>
                <SelectItem value="B">Zone B</SelectItem>
                <SelectItem value="C">Zone C</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-[200px]">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="ev">EV Charging</SelectItem>
                <SelectItem value="handicap">Accessible</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-4 w-16" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : !filteredSpots || filteredSpots.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-border rounded-lg">
              <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-1">No spots found</h3>
              <p>Try adjusting your filters.</p>
            </div>
          ) : (
            filteredSpots.map(spot => (
              <Card key={spot.id} className="bg-card border-border overflow-hidden">
                <div className={`h-2 w-full ${spot.isAvailable ? 'bg-green-500' : 'bg-red-500'}`} />
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {spot.spotNumber}
                      <Badge variant="outline" className="text-xs uppercase">{spot.zone}</Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{spot.spotType}</p>
                  </div>
                  {getSpotIcon(spot.spotType)}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status</span>
                      <span className={`font-medium ${spot.isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                        {spot.isAvailable ? 'Available' : 'Occupied'}
                      </span>
                    </div>
                    {spot.isReserved && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reservation</span>
                        <span className="font-medium text-amber-500">Reserved</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monthly</span>
                      <span className="font-medium">${spot.monthlyRate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hourly</span>
                      <span className="font-medium">${spot.hourlyRate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
