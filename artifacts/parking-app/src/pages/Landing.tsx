import React from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Car, ShieldCheck, Zap, BarChart3, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-background dark text-foreground overflow-hidden">
      {/* Navbar */}
      <nav className="border-b border-border/40 backdrop-blur-md bg-background/80 fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl">
            <Car className="h-6 w-6" />
            <span>ParkEase</span>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Login</Button>
            </Link>
            <Link href="/plans">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-white to-white/40 bg-clip-text text-transparent">
              Premium Parking.<br />Zero Friction.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              The sophisticated urban parking management platform. Secure your spot, manage subscriptions, and enjoy seamless entry—all from your dashboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/plans">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 h-14 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full">
                  View Subscriptions <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 h-14 rounded-full border-border hover:bg-white/5">
                  Explore Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Abstract Dashboard Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative mx-auto max-w-5xl"
          >
            <div className="aspect-[16/9] rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-primary/10 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/5" />
              <div className="grid grid-cols-4 gap-4 p-8 w-full h-full opacity-30">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-primary/20 bg-primary/5 flex items-center justify-center">
                    <div className="w-1/2 h-1 bg-primary/40 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="absolute font-mono text-primary/50 text-2xl font-bold">
                [ SECURE FACILITY ]
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-card/30 border-y border-border/40">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Engineered for Excellence</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to manage your parking portfolio, from real-time occupancy to automated billing.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-colors">
              <ShieldCheck className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure Access</h3>
              <p className="text-muted-foreground">Automated license plate recognition and secure digital passes for friction-free entry.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-colors">
              <Zap className="h-10 w-10 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-2">Real-time Analytics</h3>
              <p className="text-muted-foreground">Live occupancy tracking and revenue dashboards keep you informed at a glance.</p>
            </div>
            <div className="p-6 rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-colors">
              <BarChart3 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Revenue Optimization</h3>
              <p className="text-muted-foreground">Dynamic pricing and utilization heatmaps to maximize your facility's potential.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
