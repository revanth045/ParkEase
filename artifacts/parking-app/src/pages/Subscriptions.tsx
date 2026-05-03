import React from "react";
import { useListSubscriptions } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, MoreHorizontal, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function Subscriptions() {
  const { data: subscriptions, isLoading } = useListSubscriptions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelled": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "expired": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "pending": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
            <p className="text-muted-foreground">Manage customer parking subscriptions.</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Create Subscription
          </Button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>All Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ) : !subscriptions || subscriptions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-1">No subscriptions found</h3>
                <p>Get started by creating a new subscription.</p>
              </div>
            ) : (
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Spot</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Billing</TableHead>
                      <TableHead>Next Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((sub) => (
                      <TableRow key={sub.id} className="border-border hover:bg-white/5">
                        <TableCell>
                          <div className="font-medium">{sub.customerName}</div>
                          <div className="text-xs text-muted-foreground">{sub.customerEmail}</div>
                        </TableCell>
                        <TableCell>{sub.planName}</TableCell>
                        <TableCell>{sub.spotNumber || "Unassigned"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize ${getStatusColor(sub.status)}`}>
                            {sub.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="capitalize">{sub.billingCycle}</div>
                          <div className="text-xs text-muted-foreground">${sub.amount}</div>
                        </TableCell>
                        <TableCell>{new Date(sub.nextBillingDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</TableCell>
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
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              {sub.status === "active" ? (
                                <DropdownMenuItem className="text-destructive focus:text-destructive">Cancel Subscription</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>Reactivate</DropdownMenuItem>
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
