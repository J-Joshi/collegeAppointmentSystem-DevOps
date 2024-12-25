import Appointment from "../models/appointmentModel.js";
import Availability from "../models/availabilityModel.js";

export const setAppointment = async (req, res) => {
  try {
    const { professorId, timeSlot } = req.body;
    const studentId = req.user.id;

    const profAvailability = await Availability.findOne({
      professor: professorId,
    });
    if (!profAvailability) {
      return res.status(404).json({ error: "Professor has no availability." });
    }

    const isAvailable = profAvailability.timeSlots.some(
      (slot) =>
        new Date(slot.startTime).getTime() ===
          new Date(timeSlot.startTime).getTime() &&
        new Date(slot.endTime).getTime() ===
          new Date(timeSlot.endTime).getTime()
    );

    if (!isAvailable) {
      return res
        .status(400)
        .json({ error: "The selected time slot is not available." });
    }

    const existingAppointment = await Appointment.findOne({
      professor: professorId,
      "timeSlot.startTime": new Date(timeSlot.startTime),
      "timeSlot.endTime": new Date(timeSlot.endTime),
      status: "booked",
    });

    if (existingAppointment) {
      return res
        .status(400)
        .json({ error: "The time slot is already booked." });
    }

    const appointment = new Appointment({
      student: studentId,
      professor: professorId,
      timeSlot,
    });

    profAvailability.timeSlots = profAvailability.timeSlots.filter(
      (slot) =>
        new Date(slot.startTime).getTime() !==
          new Date(timeSlot.startTime).getTime() ||
        new Date(slot.endTime).getTime() !==
          new Date(timeSlot.endTime).getTime()
    );
    await profAvailability.save();

    await appointment.save();

    res
      .status(201)
      .json({ message: "Appointment booked successfully.", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to book appointment." });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await Appointment.find({
      $or: [{ student: userId }, { professor: userId }],
      status: "booked",
    })
      .populate("student", "name email")
      .populate("professor", "name email");

    // console.log(appointments);

    if (appointments.length === 0) {
      return res.status(200).json({
        message: "You do not have any pending appointments.",
        appointments: [],
      });
    }

    res.status(200).json({
      message: "Appointments fetched successfully.",
      appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch appointments." });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }
    const appProffId = appointment.professor.toString();
    const appStudId = appointment.student.toString();
    // console.log(typeof role);
    if (userId !== appProffId && userId !== appStudId) {
      return res
        .status(401)
        .json({ error: "You are not authorized to Cancel this Appointment" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment cancelled successfully.", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to cancel appointment." });
  }
};
