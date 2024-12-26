import User from "../models/userModel.js";
import Availability from "../models/availabilityModel.js";
import Appointment from "../models/appointmentModel.js";

export const fetchUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

export const fetchAvailability = async (req, res) => {
  try {
    const availability = await Availability.find().populate("professor");
    res.status(200).json(availability);
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: "Error fetching availability" });
  }
};

export const fetchAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("student")
      .populate("professor");
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ error: "Error fetching appointments" });
  }
};
