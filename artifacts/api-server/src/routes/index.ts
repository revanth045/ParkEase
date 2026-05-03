import { Router, type IRouter } from "express";
import healthRouter from "./health";
import spotsRouter from "./spots";
import vehiclesRouter from "./vehicles";
import subscriptionPlansRouter from "./subscriptionPlans";
import subscriptionsRouter from "./subscriptions";
import bookingsRouter from "./bookings";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(spotsRouter);
router.use(vehiclesRouter);
router.use(subscriptionPlansRouter);
router.use(subscriptionsRouter);
router.use(bookingsRouter);
router.use(statsRouter);

export default router;
