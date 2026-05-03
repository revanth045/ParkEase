import React from "react";
import { Link, useLocation } from "wouter";
import { 
  Car, 
  LayoutDashboard, 
  MapPin, 
  CreditCard, 
  CalendarDays, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/spots", label: "Parking Spots", icon: MapPin },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/plans", label: "Plans", icon: Settings },
  { href: "/bookings", label: "Bookings", icon: CalendarDays },
  { href: "/vehicles", label: "Vehicles", icon: Car },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const NavLinks = () => (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = location === item.href;
        return (
          <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${isActive ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row dark">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Car className="h-6 w-6" />
          <span>ParkEase</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-card border-r-border p-6 flex flex-col gap-6">
            <div className="flex items-center gap-2 text-primary font-bold text-xl mb-4">
              <Car className="h-6 w-6" />
              <span>ParkEase</span>
            </div>
            <div className="flex flex-col gap-2">
              <NavLinks />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col border-r border-border bg-card p-6 gap-8">
        <div className="flex items-center gap-2 text-primary font-bold text-2xl">
          <Car className="h-8 w-8" />
          <span>ParkEase</span>
        </div>
        <div className="flex flex-col gap-2">
          <NavLinks />
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
