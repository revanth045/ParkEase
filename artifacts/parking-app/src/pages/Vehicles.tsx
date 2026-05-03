import React from "react";
import { useListVehicles } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Vehicles() {
  const { data: vehicles, isLoading } = useListVehicles();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
            <p className="text-muted-foreground">Registry of all registered customer vehicles.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Register Vehicle
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Registered Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : !vehicles || vehicles.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No vehicles found</h3>
                <p>Register customer vehicles to assign to subscriptions.</p>
              </div>
            ) : (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>License Plate</TableHead>
                      <TableHead>Make & Model</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Color</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id} className="border-border hover:bg-white/5">
                        <TableCell>
                          <div className="font-mono text-lg font-bold bg-muted px-2 py-1 rounded inline-block">
                            {vehicle.licensePlate}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{vehicle.year} {vehicle.make}</div>
                          <div className="text-sm text-muted-foreground">{vehicle.model}</div>
                        </TableCell>
                        <TableCell className="capitalize">{vehicle.vehicleType}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded-full border border-border" 
                              style={{ backgroundColor: vehicle.color.toLowerCase() }} 
                            />
                            <span className="capitalize text-sm">{vehicle.color}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{vehicle.ownerName}</div>
                          <div className="text-xs text-muted-foreground">{vehicle.ownerEmail}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive focus:text-destructive">Remove Vehicle</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
