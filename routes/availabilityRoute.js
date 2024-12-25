import express from "express";
import {
  setAvailability,
  getAvailability,
} from "../controllers/availabilityController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, setAvailability);
router.get("/:professorId", authMiddleware, getAvailability);

export default router;
