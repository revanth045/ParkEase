import { pgTable, text, serial, boolean, numeric, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const spotTypeEnum = pgEnum("spot_type", ["standard", "compact", "ev", "handicap", "premium"]);
export const vehicleTypeEnum = pgEnum("vehicle_type", ["sedan", "suv", "truck", "compact", "ev", "motorcycle"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "cancelled", "expired", "pending"]);
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "yearly"]);
export const bookingStatusEnum = pgEnum("booking_status", ["active", "completed", "cancelled"]);
export const planSpotTypeEnum = pgEnum("plan_spot_type", ["standard", "compact", "ev", "handicap", "premium", "any"]);

export const parkingSpotsTable = pgTable("parking_spots", {
  id: serial("id").primaryKey(),
  spotNumber: text("spot_number").notNull().unique(),
  zone: text("zone").notNull(),
  floor: text("floor").notNull(),
  spotType: spotTypeEnum("spot_type").notNull().default("standard"),
  isAvailable: boolean("is_available").notNull().default(true),
  isReserved: boolean("is_reserved").notNull().default(false),
  monthlyRate: numeric("monthly_rate", { precision: 10, scale: 2 }).notNull(),
  hourlyRate: numeric("hourly_rate", { precision: 10, scale: 2 }).notNull(),
  features: text("features").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertParkingSpotSchema = createInsertSchema(parkingSpotsTable).omit({ id: true, createdAt: true });
export type InsertParkingSpot = z.infer<typeof insertParkingSpotSchema>;
export type ParkingSpot = typeof parkingSpotsTable.$inferSelect;

export const subscriptionPlansTable = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  priceMonthly: numeric("price_monthly", { precision: 10, scale: 2 }).notNull(),
  priceYearly: numeric("price_yearly", { precision: 10, scale: 2 }).notNull(),
  features: text("features").array().notNull().default([]),
  maxVehicles: integer("max_vehicles").notNull().default(1),
  spotType: planSpotTypeEnum("spot_type").notNull().default("any"),
  isPopular: boolean("is_popular").notNull().default(false),
  color: text("color").notNull().default("blue"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlansTable).omit({ id: true, createdAt: true });
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlansTable.$inferSelect;

export const vehiclesTable = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  ownerName: text("owner_name").notNull(),
  ownerEmail: text("owner_email").notNull(),
  licensePlate: text("license_plate").notNull().unique(),
  make: text("make").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  color: text("color").notNull(),
  vehicleType: vehicleTypeEnum("vehicle_type").notNull().default("sedan"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertVehicleSchema = createInsertSchema(vehiclesTable).omit({ id: true, createdAt: true });
export type InsertVehicle = z.infer<typeof insertVehicleSchema>;
export type Vehicle = typeof vehiclesTable.$inferSelect;

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  planId: integer("plan_id").notNull().references(() => subscriptionPlansTable.id),
  spotId: integer("spot_id").references(() => parkingSpotsTable.id),
  vehicleId: integer("vehicle_id").references(() => vehiclesTable.id),
  status: subscriptionStatusEnum("status").notNull().default("active"),
  billingCycle: billingCycleEnum("billing_cycle").notNull().default("monthly"),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  nextBillingDate: text("next_billing_date").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ id: true, createdAt: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  vehicleId: integer("vehicle_id").references(() => vehiclesTable.id),
  licensePlate: text("license_plate"),
  spotId: integer("spot_id").notNull().references(() => parkingSpotsTable.id),
  status: bookingStatusEnum("status").notNull().default("active"),
  startTime: text("start_time").notNull(),
  endTime: text("end_time"),
  durationHours: numeric("duration_hours", { precision: 5, scale: 2 }).notNull(),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({ id: true, createdAt: true });
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
