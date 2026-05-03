import React from "react";
import { useListBookings } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, Clock, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Bookings() {
  const { data: bookings, isLoading } = useListBookings();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString(undefined, { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hourly Bookings</h1>
            <p className="text-muted-foreground">Manage short-term parking reservations.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            New Booking
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : !bookings || bookings.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No bookings found</h3>
                <p>Create a booking for an hourly customer.</p>
              </div>
            ) : (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Customer / Plate</TableHead>
                      <TableHead>Spot</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id} className="border-border hover:bg-white/5">
                        <TableCell>
                          <div className="font-medium">{booking.customerName}</div>
                          <div className="text-xs font-mono bg-muted text-muted-foreground inline-block px-1 rounded mt-1">
                            {booking.licensePlate || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.spotNumber}</div>
                          <div className="text-xs text-muted-foreground">Zone {booking.zone}</div>
                        </TableCell>
                        <TableCell>{formatDate(booking.startTime)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span>{formatTime(booking.startTime)}</span>
                          </div>
                          {booking.endTime && (
                            <div className="text-xs text-muted-foreground ml-4">
                              to {formatTime(booking.endTime)}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{booking.durationHours ? `${booking.durationHours} hrs` : "-"}</TableCell>
                        <TableCell className="font-medium">${booking.totalAmount}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </Badge>
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
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              {booking.status === "active" && (
                                <>
                                  <DropdownMenuItem>Complete Booking</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive focus:text-destructive">Cancel Booking</DropdownMenuItem>
                                </>
                              )}
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
