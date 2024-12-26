import express from "express";
import {
  fetchUsers,
  fetchAvailability,
  fetchAppointments,
} from "../controllers/getDBdataController.js";

const router = express.Router();

router.get("/users", fetchUsers); // Endpoint to fetch all users
router.get("/availability", fetchAvailability); // Endpoint to fetch all availability
router.get("/appointments", fetchAppointments); // Endpoint to fetch all appointments

export default router;
