import { Router } from "express";
import { db, subscriptionsTable, subscriptionPlansTable, parkingSpotsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/subscriptions", async (req, res) => {
  try {
    const rows = await db
      .select({
        subscription: subscriptionsTable,
        planName: subscriptionPlansTable.name,
        spotNumber: parkingSpotsTable.spotNumber,
      })
      .from(subscriptionsTable)
      .leftJoin(subscriptionPlansTable, eq(subscriptionsTable.planId, subscriptionPlansTable.id))
      .leftJoin(parkingSpotsTable, eq(subscriptionsTable.spotId, parkingSpotsTable.id))
      .orderBy(subscriptionsTable.createdAt);
    res.json(rows.map(r => formatSubscription(r.subscription, r.planName || "", r.spotNumber || "")));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list subscriptions" });
  }
});

router.post("/subscriptions", async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, planId, spotId, vehicleId, billingCycle, startDate } = req.body;
    const [plan] = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.id, planId));
    if (!plan) return res.status(404).json({ error: "Plan not found" });
    const amount = billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly;
    const start = new Date(startDate);
    const end = new Date(start);
    if (billingCycle === "yearly") end.setFullYear(end.getFullYear() + 1);
    else end.setMonth(end.getMonth() + 1);
    const nextBilling = new Date(end);
    const [sub] = await db.insert(subscriptionsTable).values({
      customerName, customerEmail,
      customerPhone: customerPhone || null,
      planId, spotId: spotId || null, vehicleId: vehicleId || null,
      status: "active",
      billingCycle: billingCycle || "monthly",
      startDate: start.toISOString().split("T")[0],
      endDate: end.toISOString().split("T")[0],
      nextBillingDate: nextBilling.toISOString().split("T")[0],
      amount: String(amount),
    }).returning();
    if (spotId) {
      await db.update(parkingSpotsTable).set({ isReserved: true, isAvailable: false }).where(eq(parkingSpotsTable.id, spotId));
    }
    res.status(201).json(formatSubscription(sub, plan.name, ""));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create subscription" });
  }
});

router.get("/subscriptions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db
      .select({
        subscription: subscriptionsTable,
        planName: subscriptionPlansTable.name,
        spotNumber: parkingSpotsTable.spotNumber,
      })
      .from(subscriptionsTable)
      .leftJoin(subscriptionPlansTable, eq(subscriptionsTable.planId, subscriptionPlansTable.id))
      .leftJoin(parkingSpotsTable, eq(subscriptionsTable.spotId, parkingSpotsTable.id))
      .where(eq(subscriptionsTable.id, id));
    if (!row) return res.status(404).json({ error: "Subscription not found" });
    res.json(formatSubscription(row.subscription, row.planName || "", row.spotNumber || ""));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get subscription" });
  }
});

router.patch("/subscriptions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: any = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.billingCycle !== undefined) updates.billingCycle = req.body.billingCycle;
    const [sub] = await db.update(subscriptionsTable).set(updates).where(eq(subscriptionsTable.id, id)).returning();
    if (!sub) return res.status(404).json({ error: "Subscription not found" });
    const [plan] = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.id, sub.planId));
    if (sub.status === "cancelled" && sub.spotId) {
      await db.update(parkingSpotsTable).set({ isReserved: false, isAvailable: true }).where(eq(parkingSpotsTable.id, sub.spotId));
    }
    res.json(formatSubscription(sub, plan?.name || "", ""));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update subscription" });
  }
});

function formatSubscription(s: any, planName: string, spotNumber: string) {
  return {
    id: s.id,
    customerName: s.customerName,
    customerEmail: s.customerEmail,
    customerPhone: s.customerPhone || null,
    planId: s.planId,
    planName,
    spotId: s.spotId || null,
    spotNumber: spotNumber || null,
    vehicleId: s.vehicleId || null,
    status: s.status,
    billingCycle: s.billingCycle,
    startDate: s.startDate,
    endDate: s.endDate,
    nextBillingDate: s.nextBillingDate,
    amount: parseFloat(s.amount),
    createdAt: s.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export default router;
