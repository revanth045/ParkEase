import { Router } from "express";
import { db, parkingSpotsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/spots", async (req, res) => {
  try {
    const { zone, available, spotType } = req.query;
    let query = db.select().from(parkingSpotsTable);
    const conditions = [];
    if (zone) conditions.push(eq(parkingSpotsTable.zone, zone as string));
    if (available !== undefined) conditions.push(eq(parkingSpotsTable.isAvailable, available === "true"));
    if (spotType) conditions.push(eq(parkingSpotsTable.spotType, spotType as any));
    const spots = conditions.length > 0
      ? await db.select().from(parkingSpotsTable).where(and(...conditions))
      : await query;
    res.json(spots.map(formatSpot));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list spots" });
  }
});

router.post("/spots", async (req, res) => {
  try {
    const { spotNumber, zone, floor, spotType, monthlyRate, hourlyRate, features } = req.body;
    const [spot] = await db.insert(parkingSpotsTable).values({
      spotNumber, zone, floor,
      spotType: spotType || "standard",
      monthlyRate: String(monthlyRate),
      hourlyRate: String(hourlyRate),
      features: features || [],
      isAvailable: true,
      isReserved: false,
    }).returning();
    res.status(201).json(formatSpot(spot));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create spot" });
  }
});

router.get("/spots/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [spot] = await db.select().from(parkingSpotsTable).where(eq(parkingSpotsTable.id, id));
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    res.json(formatSpot(spot));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get spot" });
  }
});

router.patch("/spots/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: any = {};
    if (req.body.isAvailable !== undefined) updates.isAvailable = req.body.isAvailable;
    if (req.body.isReserved !== undefined) updates.isReserved = req.body.isReserved;
    if (req.body.monthlyRate !== undefined) updates.monthlyRate = String(req.body.monthlyRate);
    if (req.body.hourlyRate !== undefined) updates.hourlyRate = String(req.body.hourlyRate);
    const [spot] = await db.update(parkingSpotsTable).set(updates).where(eq(parkingSpotsTable.id, id)).returning();
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    res.json(formatSpot(spot));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update spot" });
  }
});

function formatSpot(spot: any) {
  return {
    id: spot.id,
    spotNumber: spot.spotNumber,
    zone: spot.zone,
    floor: spot.floor,
    spotType: spot.spotType,
    isAvailable: spot.isAvailable,
    isReserved: spot.isReserved,
    monthlyRate: parseFloat(spot.monthlyRate),
    hourlyRate: parseFloat(spot.hourlyRate),
    features: spot.features || [],
    createdAt: spot.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export default router;
