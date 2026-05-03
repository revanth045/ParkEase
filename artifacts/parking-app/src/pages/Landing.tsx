import React from "react";
import { Link } from "wouter";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  Car,
  ShieldCheck,
  Zap,
  BarChart3,
  ChevronRight,
  ArrowRight,
  Wifi,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListSubscriptionPlans } from "@workspace/api-client-react";

/* ─── Floating particle ───────────────────────────────────────────────── */
function Particle({ x, y, size, duration, delay }: { x: number; y: number; size: number; duration: number; delay: number }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/40 pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
      animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/* ─── Stat counter ────────────────────────────────────────────────────── */
function StatItem({ value, label, suffix = "" }: { value: string; label: string; suffix?: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black tracking-tighter text-white">
        {value}<span className="text-primary">{suffix}</span>
      </div>
      <div className="text-sm text-muted-foreground mt-1 uppercase tracking-widest">{label}</div>
    </div>
  );
}

/* ─── Feature card ────────────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon,
  title,
  description,
  iconColor,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  iconColor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative p-7 rounded-2xl border border-border bg-card overflow-hidden cursor-default"
      style={{ transition: "box-shadow 0.3s ease, border-color 0.3s ease" }}
    >
      {/* hover spotlight */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, hsl(195 100% 50% / 0.06) 0%, transparent 70%)" }} />
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-5 ${iconColor} transition-transform duration-300 group-hover:scale-110`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </motion.div>
  );
}

/* ─── Plan Card ───────────────────────────────────────────────────────── */
function PlanCard({ plan, billing, delay }: { plan: any; billing: "monthly" | "yearly"; delay: number }) {
  const price = billing === "yearly" ? plan.priceYearly / 12 : plan.priceMonthly;
  const isPopular = plan.isPopular;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className={`relative flex flex-col p-7 rounded-2xl border transition-all duration-300 ${
        isPopular
          ? "border-primary bg-primary/5 shadow-[0_0_40px_hsl(195_100%_50%/0.12)]"
          : "border-border bg-card hover:border-primary/30 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-primary text-primary-foreground">
          Most Popular
        </div>
      )}
      <div className="mb-4">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-muted-foreground text-sm mt-1">{plan.description}</p>
      </div>
      <div className="mb-6">
        <div className="flex items-end gap-1">
          <span className={`text-4xl font-black ${isPopular ? "text-primary text-glow-cyan" : ""}`}>
            ${price.toFixed(2)}
          </span>
          <span className="text-muted-foreground text-sm mb-1">/ month</span>
        </div>
        {billing === "yearly" && (
          <p className="text-xs text-primary mt-1">Save 20% — billed annually</p>
        )}
      </div>
      <ul className="space-y-2.5 mb-8 flex-1">
        {plan.features.map((f: string) => (
          <li key={f} className="flex items-center gap-2.5 text-sm">
            <div className={`h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0 ${isPopular ? "bg-primary/20" : "bg-primary/10"}`}>
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-muted-foreground">{f}</span>
          </li>
        ))}
      </ul>
      <Link href="/subscriptions">
        <Button
          className={`w-full rounded-xl h-11 font-semibold transition-all duration-300 ${
            isPopular
              ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_0_20px_hsl(195_100%_50%/0.4)]"
              : "bg-secondary text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/40 border border-border"
          }`}
          data-testid={`btn-plan-${plan.name}`}
        >
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </Link>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────────────────────── */
export default function Landing() {
  const [billing, setBilling] = React.useState<"monthly" | "yearly">("monthly");
  const { data: plans } = useListSubscriptionPlans();

  // Reliable scroll tracking via native event listener
  const [scrollPx, setScrollPx] = React.useState(0);
  React.useEffect(() => {
    const el = document.documentElement;
    const update = () => setScrollPx(el.scrollTop || window.scrollY || 0);
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Vehicle scale: 0.28 → 6 over 1400px of scroll
  const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const carScaleRaw = lerp(0.28, 6, clamp(scrollPx / 1400, 0, 1));
  const [smoothCarScale, setSmoothCarScale] = React.useState(0.28);
  React.useEffect(() => {
    let raf: number;
    const animate = () => {
      setSmoothCarScale(prev => {
        const diff = carScaleRaw - prev;
        if (Math.abs(diff) < 0.001) return carScaleRaw;
        return prev + diff * 0.12;
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [carScaleRaw]);

  // Hero text opacity: 1 → 0 over 0–350px scroll
  const heroTextOpacity = clamp(1 - scrollPx / 350, 0, 1);
  const heroTextY = clamp(-scrollPx * 0.17, -60, 0);

  // Car opacity: 1 → 0 over 900–1300px
  const carOpacity = clamp(1 - (scrollPx - 900) / 400, 0, 1);

  // Mid-scroll label
  const zoomLabelT = clamp((scrollPx - 200) / 200, 0, 1);
  const zoomLabelFade = clamp(1 - (scrollPx - 900) / 200, 0, 1);
  const zoomLabelOpacity = zoomLabelT * zoomLabelFade;

  const particles = React.useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 5,
    })), []);

  return (
    <div className="bg-background dark text-foreground overflow-x-hidden">
      {/* ── Navbar ── */}
      <nav className="border-b border-border/30 backdrop-blur-xl bg-background/70 fixed top-0 w-full z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Car className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-lg tracking-tight">ParkEase</span>
          </motion.div>

          <motion.div
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {["Features", "Plans", "Dashboard"].map((item) => (
              <Link
                key={item}
                href={item === "Dashboard" ? "/dashboard" : `/#${item.toLowerCase()}`}
              >
                <span className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer relative group">
                  {item}
                  <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </span>
              </Link>
            ))}
          </motion.div>

          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-sm" data-testid="btn-login">
                Sign in
              </Button>
            </Link>
            <Link href="/plans">
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-5 font-semibold text-sm transition-all duration-300 hover:shadow-[0_0_16px_hsl(195_100%_50%/0.4)]"
                data-testid="btn-get-started"
              >
                Get started
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* ── Hero + Scroll-Zoom Vehicle Section ── */}
      <section className="relative" style={{ height: "280vh" }}>
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">
          {/* Background grid */}
          <div className="absolute inset-0 grid-bg opacity-60 z-0" />

          {/* Radial vignette */}
          <div className="absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 60%, transparent 0%, hsl(215 40% 4%) 80%)" }} />

          {/* Horizon glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] rounded-full opacity-20 blur-[80px] z-0"
            style={{ background: "radial-gradient(ellipse, hsl(195 100% 50%) 0%, transparent 70%)" }} />

          {/* ─── Scroll-scaling vehicle — placed BEFORE text so text is on top ─── */}
          <div
            style={{ transform: `scale(${smoothCarScale})`, opacity: carOpacity, willChange: "transform, opacity" }}
            className="absolute inset-0 z-[1] flex items-end justify-center pb-[8%] pointer-events-none"
          >
            <div className="relative w-[78vw] max-w-[1050px]">
              {/* Undercar glow */}
              <div className="absolute bottom-[-2%] left-[10%] right-[10%] h-[18%] rounded-full blur-2xl"
                style={{ background: "radial-gradient(ellipse, rgba(0,210,255,0.55) 0%, rgba(0,160,210,0.25) 50%, transparent 80%)" }} />
              {/* Ground shadow */}
              <div className="absolute bottom-[-6%] left-[5%] right-[5%] h-[8%] rounded-full blur-xl"
                style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.8) 0%, transparent 70%)" }} />
              <img
                src="/hero-car-nobg.png"
                alt="Luxury parking vehicle"
                className="w-full h-auto relative z-10"
                style={{ filter: "drop-shadow(0 0 60px rgba(0,210,255,0.35)) drop-shadow(0 20px 40px rgba(0,0,0,0.8))" }}
              />
            </div>
          </div>

          {/* Particles */}
          {particles.map((p) => (
            <Particle key={p.id} {...p} />
          ))}

          {/* Hero text — fades out on scroll */}
          <div
            style={{ opacity: heroTextOpacity, transform: `translateY(${heroTextY}px)`, willChange: "opacity, transform" }}
            className="relative z-20 text-center px-4 mb-8 pointer-events-none select-none"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-6">
              <div className="h-1.5 w-1.5 rounded-full bg-primary pulse-glow" />
              Next-gen parking platform
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
              <span className="bg-gradient-to-b from-white via-white/90 to-white/40 bg-clip-text text-transparent">
                Premium
                <br />
                Parking.
              </span>
              <br />
              <span className="text-primary text-glow-cyan">Zero Friction.</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10">
              Secure your spot. Manage subscriptions. Enjoy seamless entry —
              all from one powerful dashboard.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pointer-events-auto"
            >
              <Link href="/plans">
                <Button
                  size="lg"
                  className="rounded-full px-8 h-13 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_30px_hsl(195_100%_50%/0.5)] group"
                  data-testid="btn-hero-plans"
                >
                  View Plans
                  <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 h-13 text-base border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-300 group"
                  data-testid="btn-hero-dashboard"
                >
                  Explore Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Zoom hint text */}
          <div
            style={{ opacity: zoomLabelOpacity, willChange: "opacity" }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none"
          >
            <p className="text-primary/70 text-sm font-semibold uppercase tracking-[0.3em]">
              Pure Performance
            </p>
            <p className="text-white/30 text-xs mt-1">Engineered for urban life</p>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            style={{ opacity: heroTextOpacity, willChange: "opacity" }}
          >
            <span className="text-muted-foreground text-xs uppercase tracking-widest">Scroll</span>
            <motion.div
              className="w-px h-10 bg-gradient-to-b from-primary/60 to-transparent"
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="py-20 border-y border-border/40 bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 shimmer pointer-events-none" />
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { value: "10K+", label: "Active drivers" },
              { value: "98%", label: "Uptime SLA" },
              { value: "50+", label: "Facilities" },
              { value: "$2M+", label: "Revenue managed" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <StatItem value={stat.value} label={stat.label} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-28 px-6 relative">
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs uppercase tracking-widest mb-4">
              <Zap className="h-3 w-3" />
              Built for scale
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Engineered for{" "}
              <span className="text-primary text-glow-cyan">Excellence</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to manage your parking portfolio — from real-time occupancy to automated billing.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={ShieldCheck}
              title="Secure Access Control"
              description="License plate recognition and encrypted digital passes for completely friction-free entry. No tickets, no delays."
              iconColor="bg-primary/10 text-primary"
              delay={0}
            />
            <FeatureCard
              icon={Zap}
              title="Real-time Analytics"
              description="Live occupancy heatmaps, revenue dashboards, and predictive insights keep you ahead of every trend."
              iconColor="bg-amber-500/10 text-amber-400"
              delay={0.1}
            />
            <FeatureCard
              icon={BarChart3}
              title="Revenue Optimization"
              description="Dynamic pricing algorithms and utilization analytics automatically maximize your facility's earnings."
              iconColor="bg-green-500/10 text-green-400"
              delay={0.2}
            />
            <FeatureCard
              icon={Wifi}
              title="Connected Infrastructure"
              description="IoT-enabled sensors provide second-by-second availability updates across every zone and level."
              iconColor="bg-purple-500/10 text-purple-400"
              delay={0.3}
            />
            <FeatureCard
              icon={Clock}
              title="24/7 Automated Billing"
              description="Subscription renewals, invoices, and payment processing run without any manual intervention."
              iconColor="bg-primary/10 text-primary"
              delay={0.4}
            />
            <FeatureCard
              icon={Star}
              title="Premium Experience"
              description="Curated amenities — EV charging, valet, concierge — bundled seamlessly into subscription tiers."
              iconColor="bg-amber-500/10 text-amber-400"
              delay={0.5}
            />
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="plans" className="py-28 px-6 bg-card/20 border-y border-border/40">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs uppercase tracking-widest mb-4">
              <Star className="h-3 w-3" />
              Subscription plans
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Simple, transparent{" "}
              <span className="text-primary text-glow-cyan">pricing</span>
            </h2>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 mt-6 p-1.5 rounded-full bg-secondary/80 border border-border">
              <button
                onClick={() => setBilling("monthly")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${billing === "monthly" ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(195_100%_50%/0.4)]" : "text-muted-foreground hover:text-foreground"}`}
                data-testid="toggle-monthly"
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${billing === "yearly" ? "bg-primary text-primary-foreground shadow-[0_0_12px_hsl(195_100%_50%/0.4)]" : "text-muted-foreground hover:text-foreground"}`}
                data-testid="toggle-yearly"
              >
                Yearly
                <AnimatePresence>
                  {billing === "yearly" && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full font-bold"
                    >
                      Save 20%
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans?.map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} billing={billing} delay={i * 0.1} />
            ))}
            {!plans && [0, 1, 2].map((i) => (
              <div key={i} className="h-96 rounded-2xl border border-border bg-card animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] rounded-full blur-[120px] opacity-10"
            style={{ background: "radial-gradient(ellipse, hsl(195 100% 50%) 0%, transparent 70%)" }} />
        </div>
        <div className="container mx-auto max-w-3xl text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-tight">
              Your spot is{" "}
              <span className="text-primary text-glow-cyan">waiting.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Join thousands of drivers who've upgraded their parking experience. Reserve your spot in under 2 minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/subscriptions">
                <Button
                  size="lg"
                  className="rounded-full px-10 h-14 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:shadow-[0_0_40px_hsl(195_100%_50%/0.5)] group"
                  data-testid="btn-cta-subscribe"
                >
                  Start your subscription
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1.5" />
                </Button>
              </Link>
              <Link href="/spots">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-10 h-14 text-base border-border/60 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all duration-300"
                  data-testid="btn-cta-spots"
                >
                  Browse spots
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border/40 py-10 px-6">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Car className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="font-bold text-base tracking-tight">ParkEase</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2026 ParkEase. Premium parking infrastructure.</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((item) => (
              <span key={item} className="text-muted-foreground text-sm hover:text-foreground cursor-pointer transition-colors duration-200">
                {item}
              </span>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
