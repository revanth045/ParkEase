import React, { useState } from "react";
import { useListSubscriptionPlans } from "@workspace/api-client-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Settings } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Plans() {
  const { data: plans, isLoading } = useListSubscriptionPlans();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-center sm:text-left">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
            <p className="text-muted-foreground mt-2">Configure pricing tiers and features.</p>
          </div>
          
          <div className="flex items-center space-x-2 bg-card p-2 rounded-lg border border-border">
            <Label htmlFor="billing-toggle" className={`cursor-pointer ${!isYearly ? 'text-primary' : 'text-muted-foreground'}`}>Monthly</Label>
            <Switch
              id="billing-toggle"
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <Label htmlFor="billing-toggle" className={`cursor-pointer flex items-center gap-2 ${isYearly ? 'text-primary' : 'text-muted-foreground'}`}>
              Yearly
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">Save 20%</Badge>
            </Label>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <Card key={i} className="bg-card border-border">
                <CardHeader>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-3/4 mb-6" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(j => <Skeleton key={j} className="h-4 w-full" />)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !plans || plans.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-lg border border-border">
            <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-1">No plans configured</h3>
            <p>Create subscription plans to offer them to customers.</p>
            <Button className="mt-4">Create Plan</Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`bg-card flex flex-col relative overflow-hidden ${plan.isPopular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'}`}>
                {plan.isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                      MOST POPULAR
                    </div>
                  </div>
                )}
                <div className="h-2 w-full" style={{ backgroundColor: plan.color || 'hsl(var(--primary))' }} />
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-foreground">
                      ${isYearly ? plan.priceYearly : plan.priceMonthly}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      / {isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Features included:</div>
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className={`w-full ${plan.isPopular ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                    Edit Plan
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
