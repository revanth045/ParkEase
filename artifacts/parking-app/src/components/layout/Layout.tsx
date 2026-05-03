import React from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Car,
  LayoutDashboard,
  MapPin,
  CreditCard,
  CalendarDays,
  Settings,
  Menu,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/spots", label: "Parking Spots", icon: MapPin },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/plans", label: "Plans", icon: Settings },
  { href: "/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/vehicles", label: "Vehicles", icon: Users },
];

function NavLinks({ onClose }: { onClose?: () => void }) {
  const [location] = useLocation();
  return (
    <>
      {NAV_ITEMS.map((item, i) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} onClick={onClose}>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  style={{ boxShadow: "inset 0 0 20px hsl(195 100% 50% / 0.08)" }}
                />
              )}
              {/* hover background */}
              {!isActive && (
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/[0.04]" />
              )}
              {/* left indicator */}
              <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 rounded-full transition-all duration-200 ${
                isActive ? "h-6 bg-primary" : "h-0 group-hover:h-4 bg-primary/50"
              }`} />
              <item.icon className={`relative h-4 w-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary" : ""}`} />
              <span className="relative text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className="absolute right-3 h-1.5 w-1.5 rounded-full bg-primary pulse-glow" />
              )}
            </motion.div>
          </Link>
        );
      })}
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row dark">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card sticky top-0 z-40">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Car className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-lg text-foreground">ParkEase</span>
          </div>
        </Link>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-card border-r border-border p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Car className="h-4 w-4 text-primary" />
              </div>
              <span className="font-bold text-xl text-foreground">ParkEase</span>
            </div>
            <div className="flex flex-col gap-1">
              <NavLinks onClose={() => setIsMobileMenuOpen(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-60 flex-col border-r border-border bg-card p-5 gap-8 sticky top-0 h-screen overflow-y-auto">
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer group">
            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/40 group-hover:shadow-[0_0_16px_hsl(195_100%_50%/0.2)]">
              <Car className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
            </div>
            <span className="font-bold text-xl tracking-tight">ParkEase</span>
          </div>
        </Link>

        <div className="flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold mb-2 px-3">Navigation</p>
          <NavLinks />
        </div>

        <div className="mt-auto">
          <div className="rounded-xl border border-primary/15 bg-primary/5 p-4">
            <p className="text-xs font-semibold text-primary mb-1">Pro Plan Active</p>
            <p className="text-[11px] text-muted-foreground">Next billing in 18 days</p>
            <div className="mt-3 h-1 rounded-full bg-primary/10 overflow-hidden">
              <div className="h-full w-[60%] rounded-full bg-primary/60" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
