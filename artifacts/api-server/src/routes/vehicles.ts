import { Router } from "express";
import { db, vehiclesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await db.select().from(vehiclesTable).orderBy(vehiclesTable.createdAt);
    res.json(vehicles.map(formatVehicle));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list vehicles" });
  }
});

router.post("/vehicles", async (req, res) => {
  try {
    const { ownerName, ownerEmail, licensePlate, make, model, year, color, vehicleType } = req.body;
    const [vehicle] = await db.insert(vehiclesTable).values({
      ownerName, ownerEmail, licensePlate, make, model,
      year: parseInt(year),
      color,
      vehicleType: vehicleType || "sedan",
    }).returning();
    res.status(201).json(formatVehicle(vehicle));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create vehicle" });
  }
});

router.get("/vehicles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [vehicle] = await db.select().from(vehiclesTable).where(eq(vehiclesTable.id, id));
    if (!vehicle) return res.status(404).json({ error: "Vehicle not found" });
    res.json(formatVehicle(vehicle));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get vehicle" });
  }
});

router.delete("/vehicles/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(vehiclesTable).where(eq(vehiclesTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to delete vehicle" });
  }
});

function formatVehicle(v: any) {
  return {
    id: v.id,
    ownerName: v.ownerName,
    ownerEmail: v.ownerEmail,
    licensePlate: v.licensePlate,
    make: v.make,
    model: v.model,
    year: v.year,
    color: v.color,
    vehicleType: v.vehicleType,
    createdAt: v.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export default router;
