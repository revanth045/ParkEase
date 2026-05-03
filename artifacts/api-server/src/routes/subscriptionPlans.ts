import { Router } from "express";
import { db, subscriptionPlansTable } from "@workspace/db";

const router = Router();

router.get("/subscription-plans", async (req, res) => {
  try {
    const plans = await db.select().from(subscriptionPlansTable).orderBy(subscriptionPlansTable.priceMonthly);
    res.json(plans.map(formatPlan));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list subscription plans" });
  }
});

router.post("/subscription-plans", async (req, res) => {
  try {
    const { name, description, priceMonthly, priceYearly, features, maxVehicles, spotType, isPopular, color } = req.body;
    const [plan] = await db.insert(subscriptionPlansTable).values({
      name, description,
      priceMonthly: String(priceMonthly),
      priceYearly: String(priceYearly),
      features: features || [],
      maxVehicles: maxVehicles || 1,
      spotType: spotType || "any",
      isPopular: isPopular || false,
      color: color || "blue",
    }).returning();
    res.status(201).json(formatPlan(plan));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create subscription plan" });
  }
});

function formatPlan(p: any) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    priceMonthly: parseFloat(p.priceMonthly),
    priceYearly: parseFloat(p.priceYearly),
    features: p.features || [],
    maxVehicles: p.maxVehicles,
    spotType: p.spotType,
    isPopular: p.isPopular,
    color: p.color,
  };
}

export default router;
