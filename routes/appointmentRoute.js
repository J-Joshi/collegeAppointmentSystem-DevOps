import express from "express";
import {
  setAppointment,
  getAppointments,
  cancelAppointment,
} from "../controllers/appointmentController.js";
import authMiddleware from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/setappointment", authMiddleware, setAppointment);

router.get("/getappointment", authMiddleware, getAppointments);

router.delete(
  "/cancelappointment/:appointmentId",
  authMiddleware,
  cancelAppointment
);

export default router;
