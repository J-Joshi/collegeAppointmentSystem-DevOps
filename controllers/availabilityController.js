import Availability from "../models/availabilityModel.js";
import User from "../models/userModel.js";

export const setAvailability = async (req, res) => {
  try {
    if (req.user.role !== "professor") {
      return res.status(403).json({
        error: "Access denied. Only professors can set availability.",
      });
    }

    const { timeSlots } = req.body;
    const professor = req.user.id;

    let availability = await Availability.findOne({ professor });

    if (!availability) {
      availability = new Availability({ professor, timeSlots: [] });
    }

    const collidingSlots = [];
    for (const newSlot of timeSlots) {
      const { startTime, endTime } = newSlot;

      if (!startTime || !endTime || new Date(startTime) >= new Date(endTime)) {
        return res.status(400).json({
          error:
            "Invalid time slot format .... or .... endTime is earlier than startTime.",
        });
      }

      const overlap = availability.timeSlots.some((existingSlot) => {
        const existingStart = new Date(existingSlot.startTime);
        const existingEnd = new Date(existingSlot.endTime);
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);

        return (
          (newStart >= existingStart && newStart < existingEnd) ||
          (newEnd > existingStart && newEnd <= existingEnd) ||
          (newStart <= existingStart && newEnd >= existingEnd)
        );
      });

      if (overlap) {
        collidingSlots.push(newSlot);
      } else {
        availability.timeSlots.push({ startTime, endTime });
      }
    }

    if (collidingSlots.length > 0) {
      return res.status(400).json({
        error: "Some time slots collide with existing availability.",
        collidingSlots,
      });
    }

    await availability.save();

    res.status(200).json({
      message: "Availability updated successfully.",
      professor: availability.professor._id,
      availability: availability.timeSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update availability." });
  }
};

export const getAvailability = async (req, res) => {
  try {
    const { professorId } = req.params;
    const professor = await User.findOne({ _id: professorId });
    const role = professor.role;
    // console.log(professor);
    if (role === "student") {
      return res
        .status(404)
        .json({ error: "Please check for the availability of a Professor" });
    }

    const availability = await Availability.findOne({ professor: professorId });

    if (!availability) {
      return res
        .status(404)
        .json({ error: "No availability found for this professor." });
    }

    res.status(200).json({
      message: "Availability fetched successfully.",
      availability: availability.timeSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch availability." });
  }
};
