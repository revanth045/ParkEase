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

/* ─── SVG Car ─────────────────────────────────────────────────────────── */
function SleekCar({ glowIntensity = 1 }: { glowIntensity?: number }) {
  return (
    <svg
      viewBox="0 0 900 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: `drop-shadow(0 0 ${40 * glowIntensity}px rgba(0,210,255,${0.5 * glowIntensity})) drop-shadow(0 0 ${80 * glowIntensity}px rgba(0,180,255,${0.2 * glowIntensity}))` }}
    >
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a4f6e" />
          <stop offset="40%" stopColor="#0d3a54" />
          <stop offset="100%" stopColor="#061e2e" />
        </linearGradient>
        <linearGradient id="roofGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a7fa8" />
          <stop offset="100%" stopColor="#0d3a54" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0066aa" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="wheelGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        <radialGradient id="rimGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#004466" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#001a2e" stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id="headlightGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#00d4ff" />
          <stop offset="100%" stopColor="#003355" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="taillightGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4444" />
          <stop offset="60%" stopColor="#cc0000" />
          <stop offset="100%" stopColor="#330000" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="450" cy="310" rx="370" ry="18" fill="rgba(0,0,0,0.5)" />

      {/* Ground reflection */}
      <ellipse cx="450" cy="308" rx="320" ry="6" fill="rgba(0,210,255,0.04)" />

      {/* Main body lower */}
      <path d="M80 240 Q85 200 120 195 L780 195 Q820 195 825 230 L840 270 Q845 285 820 290 L80 290 Q60 288 65 270 Z" fill="url(#bodyGrad)" />

      {/* Body side panel accent line */}
      <path d="M130 230 L780 230" stroke="rgba(0,210,255,0.15)" strokeWidth="1.5" />
      <path d="M130 250 L780 250" stroke="rgba(0,210,255,0.08)" strokeWidth="1" />

      {/* Roof / cabin */}
      <path d="M270 195 Q300 120 360 108 L570 108 Q640 112 670 195 Z" fill="url(#roofGrad)" />

      {/* Roof highlight */}
      <path d="M300 185 Q330 130 380 118 L555 118 Q615 125 640 185 Z" fill="rgba(255,255,255,0.04)" />

      {/* Front windshield */}
      <path d="M620 195 Q650 140 660 112 L570 108 Q610 120 620 195 Z" fill="url(#glassGrad)" filter="url(#glow)" />

      {/* Rear windshield */}
      <path d="M280 195 Q275 140 270 112 L360 108 Q320 130 310 195 Z" fill="url(#glassGrad)" filter="url(#glow)" />

      {/* Side windows */}
      <path d="M320 195 L340 120 L450 118 L450 195 Z" fill="url(#glassGrad)" opacity="0.8" />
      <path d="M460 195 L460 118 L560 120 L610 195 Z" fill="url(#glassGrad)" opacity="0.8" />

      {/* Window pillars */}
      <line x1="450" y1="118" x2="450" y2="195" stroke="rgba(0,210,255,0.3)" strokeWidth="3" />

      {/* Front bumper/fascia */}
      <path d="M780 195 Q830 200 845 225 L845 270 L780 270 Z" fill="#0a2a3e" />
      <path d="M790 210 Q825 215 835 235 L835 258 L790 258 Z" fill="#061520" />

      {/* Rear bumper */}
      <path d="M120 195 Q75 202 68 228 L65 270 L120 270 Z" fill="#0a2a3e" />

      {/* Headlights */}
      <ellipse cx="830" cy="225" rx="12" ry="8" fill="url(#headlightGrad)" filter="url(#glow)" />
      <ellipse cx="828" cy="225" rx="8" ry="5" fill="white" opacity="0.9" />
      {/* headlight glow ray */}
      <path d="M842 222 L900 190 L900 200 L842 228 Z" fill="rgba(0,212,255,0.06)" />
      <path d="M842 225 L910 220 L910 230 L842 225 Z" fill="rgba(0,212,255,0.04)" />

      {/* DRL strip */}
      <path d="M800 213 Q815 210 835 213" stroke="rgba(0,220,255,0.8)" strokeWidth="2" fill="none" />

      {/* Taillights */}
      <rect x="68" y="215" width="16" height="20" rx="3" fill="url(#taillightGrad)" filter="url(#glow)" />
      {/* taillight glow */}
      <path d="M68 215 L20 205 L20 240 L68 235 Z" fill="rgba(255,50,50,0.04)" />

      {/* Rear light strip */}
      <path d="M80 218 Q90 216 105 218" stroke="rgba(255,60,60,0.7)" strokeWidth="1.5" fill="none" />

      {/* Door lines */}
      <path d="M320 200 L320 278" stroke="rgba(0,210,255,0.12)" strokeWidth="1" />
      <path d="M460 200 L460 278" stroke="rgba(0,210,255,0.12)" strokeWidth="1" />
      <path d="M610 200 L610 278" stroke="rgba(0,210,255,0.12)" strokeWidth="1" />

      {/* Door handles */}
      <rect x="380" y="238" width="30" height="5" rx="2.5" fill="rgba(0,210,255,0.4)" />
      <rect x="520" y="238" width="30" height="5" rx="2.5" fill="rgba(0,210,255,0.4)" />

      {/* Rocker panel / side skirt */}
      <path d="M155 278 L760 278 L760 290 Q760 295 750 295 L165 295 Q155 295 155 290 Z" fill="#051525" />
      <path d="M155 278 L760 278" stroke="rgba(0,210,255,0.2)" strokeWidth="1" />

      {/* Front wheel arch */}
      <path d="M170 290 Q170 205 245 205 Q320 205 320 290 Z" fill="#061a28" />
      <circle cx="245" cy="280" r="70" fill="url(#wheelGrad)" />
      <circle cx="245" cy="280" r="65" fill="#0a0a0a" />
      {/* Rim spokes */}
      {[0,60,120,180,240,300].map((angle, i) => (
        <line
          key={i}
          x1={245 + 8 * Math.cos(angle * Math.PI / 180)}
          y1={280 + 8 * Math.sin(angle * Math.PI / 180)}
          x2={245 + 52 * Math.cos(angle * Math.PI / 180)}
          y2={280 + 52 * Math.sin(angle * Math.PI / 180)}
          stroke="rgba(0,210,255,0.6)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="245" cy="280" r="55" fill="none" stroke="rgba(0,210,255,0.15)" strokeWidth="1" />
      <circle cx="245" cy="280" r="8" fill="url(#rimGrad)" />
      <circle cx="245" cy="280" r="5" fill="#00d4ff" opacity="0.8" />

      {/* Front brake caliper */}
      <rect x="220" y="255" width="14" height="24" rx="3" fill="rgba(255,60,60,0.7)" />

      {/* Rear wheel arch */}
      <path d="M625 290 Q625 205 700 205 Q775 205 775 290 Z" fill="#061a28" />
      <circle cx="700" cy="280" r="70" fill="url(#wheelGrad)" />
      <circle cx="700" cy="280" r="65" fill="#0a0a0a" />
      {[0,60,120,180,240,300].map((angle, i) => (
        <line
          key={i}
          x1={700 + 8 * Math.cos(angle * Math.PI / 180)}
          y1={280 + 8 * Math.sin(angle * Math.PI / 180)}
          x2={700 + 52 * Math.cos(angle * Math.PI / 180)}
          y2={280 + 52 * Math.sin(angle * Math.PI / 180)}
          stroke="rgba(0,210,255,0.6)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      ))}
      <circle cx="700" cy="280" r="55" fill="none" stroke="rgba(0,210,255,0.15)" strokeWidth="1" />
      <circle cx="700" cy="280" r="8" fill="url(#rimGrad)" />
      <circle cx="700" cy="280" r="5" fill="#00d4ff" opacity="0.8" />

      {/* Rear brake caliper */}
      <rect x="680" y="255" width="14" height="24" rx="3" fill="rgba(255,60,60,0.7)" />

      {/* Trunk badge / logo area */}
      <rect x="82" y="252" width="24" height="10" rx="2" fill="rgba(0,210,255,0.2)" stroke="rgba(0,210,255,0.4)" strokeWidth="0.5" />

      {/* Antenna */}
      <line x1="490" y1="108" x2="500" y2="70" stroke="rgba(0,210,255,0.3)" strokeWidth="1.5" />
      <circle cx="500" cy="68" r="2" fill="rgba(0,210,255,0.5)" />

      {/* Hood line */}
      <path d="M680 195 Q730 190 780 195" stroke="rgba(0,210,255,0.2)" strokeWidth="1.5" fill="none" />
      <path d="M780 195 Q800 200 820 212" stroke="rgba(0,210,255,0.15)" strokeWidth="1" fill="none" />

      {/* Undercarriage glow */}
      <ellipse cx="450" cy="295" rx="280" ry="4" fill="rgba(0,210,255,0.06)" />
    </svg>
  );
}

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
            className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
          >
            <div className="w-[70vw] max-w-[900px]">
              <SleekCar />
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
