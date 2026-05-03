import { Router } from "express";
import { db, bookingsTable, parkingSpotsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/bookings", async (req, res) => {
  try {
    const { status, vehicleId } = req.query;
    const conditions = [];
    if (status) conditions.push(eq(bookingsTable.status, status as any));
    if (vehicleId) conditions.push(eq(bookingsTable.vehicleId, parseInt(vehicleId as string)));
    const rows = await db
      .select({ booking: bookingsTable, spotNumber: parkingSpotsTable.spotNumber, zone: parkingSpotsTable.zone })
      .from(bookingsTable)
      .leftJoin(parkingSpotsTable, eq(bookingsTable.spotId, parkingSpotsTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(bookingsTable.createdAt);
    res.json(rows.map(r => formatBooking(r.booking, r.spotNumber || "", r.zone || "")));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to list bookings" });
  }
});

router.post("/bookings", async (req, res) => {
  try {
    const { customerName, customerEmail, vehicleId, licensePlate, spotId, startTime, durationHours } = req.body;
    const [spot] = await db.select().from(parkingSpotsTable).where(eq(parkingSpotsTable.id, spotId));
    if (!spot) return res.status(404).json({ error: "Spot not found" });
    const totalAmount = parseFloat(spot.hourlyRate) * parseFloat(durationHours);
    const [booking] = await db.insert(bookingsTable).values({
      customerName, customerEmail,
      vehicleId: vehicleId || null,
      licensePlate: licensePlate || null,
      spotId,
      status: "active",
      startTime,
      durationHours: String(durationHours),
      totalAmount: String(totalAmount.toFixed(2)),
    }).returning();
    await db.update(parkingSpotsTable).set({ isAvailable: false }).where(eq(parkingSpotsTable.id, spotId));
    res.status(201).json(formatBooking(booking, spot.spotNumber, spot.zone));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

router.get("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [row] = await db
      .select({ booking: bookingsTable, spotNumber: parkingSpotsTable.spotNumber, zone: parkingSpotsTable.zone })
      .from(bookingsTable)
      .leftJoin(parkingSpotsTable, eq(bookingsTable.spotId, parkingSpotsTable.id))
      .where(eq(bookingsTable.id, id));
    if (!row) return res.status(404).json({ error: "Booking not found" });
    res.json(formatBooking(row.booking, row.spotNumber || "", row.zone || ""));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to get booking" });
  }
});

router.patch("/bookings/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates: any = {};
    if (req.body.status !== undefined) updates.status = req.body.status;
    if (req.body.endTime !== undefined) updates.endTime = req.body.endTime;
    const [booking] = await db.update(bookingsTable).set(updates).where(eq(bookingsTable.id, id)).returning();
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    if ((req.body.status === "completed" || req.body.status === "cancelled") && booking.spotId) {
      const [spot] = await db.select().from(parkingSpotsTable).where(eq(parkingSpotsTable.id, booking.spotId));
      if (spot && !spot.isReserved) {
        await db.update(parkingSpotsTable).set({ isAvailable: true }).where(eq(parkingSpotsTable.id, booking.spotId));
      }
    }
    const [spot] = await db.select().from(parkingSpotsTable).where(eq(parkingSpotsTable.id, booking.spotId));
    res.json(formatBooking(booking, spot?.spotNumber || "", spot?.zone || ""));
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

function formatBooking(b: any, spotNumber: string, zone: string) {
  return {
    id: b.id,
    customerName: b.customerName,
    customerEmail: b.customerEmail,
    vehicleId: b.vehicleId || null,
    licensePlate: b.licensePlate || null,
    spotId: b.spotId,
    spotNumber,
    zone,
    status: b.status,
    startTime: b.startTime,
    endTime: b.endTime || null,
    durationHours: parseFloat(b.durationHours),
    totalAmount: parseFloat(b.totalAmount),
    createdAt: b.createdAt?.toISOString() || new Date().toISOString(),
  };
}

export default router;
