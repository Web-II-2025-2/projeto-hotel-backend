import { Router } from "express";
import { RoomServiceController } from "../controllers/RoomServiceController";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { AccessLevel } from "../constants/roles";

const router = Router();
const controller = new RoomServiceController();

router.post(
  "/:id/room-service",
  authenticate,
  authorize(AccessLevel.AUTHENTICATED),
  controller.requestService.bind(controller)
);

router.get(
  "/:id/room-service",
  authenticate,
  authorize(AccessLevel.AUTHENTICATED),
  controller.getByReservation.bind(controller)
);

router.get(
  "/room-service/all",
  authenticate,
  authorize(AccessLevel.EMPLOYEE),
  controller.getAll.bind(controller)
);

export { router as roomServiceRoutes };