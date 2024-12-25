import request from "supertest";
import app from "../index.js";
import mongoose from "mongoose";
const e2eTestCase = async () => {
  try {
    let A1Token, A2Token, P1Token, P1Id, appointmentId;

    const registerA1 = await request(app).post("/api/users/register").send({
      name: "A1",
      email: "a110@example.com",
      password: "A1",
      role: "student",
    });
    if (!registerA1.ok) {
      throw new Error(`Step 1 Registeration Failed - ${registerA1.body.error}`);
    }
    const loginA1 = await request(app).post("/api/users/login").send({
      email: "a110@example.com",
      password: "A1",
    });
    if (!loginA1.body.token) {
      throw new Error(`Step 1 login failed ${loginA1.body.error}`);
    }
    A1Token = loginA1.body.token;
    console.log("Step 1 Complete --> A1 Register and Login Successful");

    const registerP1 = await request(app).post("/api/users/register").send({
      name: "P1",
      email: "p110@example.com",
      password: "P1",
      role: "professor",
    });
    if (!registerP1.ok) {
      throw new Error(`Step 2 Registeration Failed- ${registerP1.body.error}`);
    }
    const loginP1 = await request(app).post("/api/users/login").send({
      email: "p110@example.com",
      password: "P1",
    });
    if (!loginP1.body.token || !loginP1.body.user?._id) {
      throw new Error(`Step 2 Login Failed- ${loginP1.body.error}`);
    }
    P1Token = loginP1.body.token;
    P1Id = loginP1.body.user._id;
    console.log(`Step 2 Complete --> P1 Register and Login Successful`);

    const P1Availability = await request(app)
      .post("/api/availability")
      .set("Authorization", `Bearer ${P1Token}`)
      .send({
        timeSlots: [
          {
            startTime: "2024-12-21T22:00:00Z",
            endTime: "2024-12-21T23:00:00Z",
          },
          {
            startTime: "2024-12-22T01:00:00Z",
            endTime: "2024-12-22T02:00:00Z",
          },
        ],
      });
    if (!P1Availability.ok) {
      throw new Error("Step 3 Failed");
    }
    console.log("Step 3 Complete --> Availability set for P1");

    const availableSlotsA1 = await request(app)
      .get(`/api/availability/${P1Id}`)
      .set("Authorization", `Bearer ${A1Token}`);
    if (!availableSlotsA1.body.availability) {
      throw new Error(`Step 4 Login Failed- ${availableSlotsA1.body.error}`);
    }
    console.log("Step 4 Complete --> A1 view P1 availability.");

    const bookA1 = await request(app)
      .post("/api/appointments/setappointment")
      .set("Authorization", `Bearer ${A1Token}`)
      .send({
        professorId: P1Id,
        timeSlot: {
          startTime: "2024-12-21T22:00:00Z",
          endTime: "2024-12-21T23:00:00Z",
        },
      });
    if (!bookA1.body.appointment || !bookA1.body.appointment._id) {
      throw new Error(`Step 5 Failed- ${bookA1.body.error}`);
    }
    appointmentId = bookA1.body.appointment._id;
    console.log("Step 5 Complete --> A1 books appointment with P1.");

    const registerA2 = await request(app).post("/api/users/register").send({
      name: "A2",
      email: "a220@example.com",
      password: "A2",
      role: "student",
    });
    if (!registerA2.ok) {
      throw new Error(`Step 6 Registeration Failed- ${registerA2.body.error}`);
    }
    const loginA2 = await request(app).post("/api/users/login").send({
      email: "a220@example.com",
      password: "A2",
    });
    if (!loginA2.body.token) {
      throw new Error(`Step 6 Login Failed- ${loginA2.body.error}`);
    }
    A2Token = loginA2.body.token;
    console.log("Step 6 Complete --> A2 Register and Login Successful");

    const bookA2 = await request(app)
      .post("/api/appointments/setappointment")
      .set("Authorization", `Bearer ${A2Token}`)
      .send({
        professorId: P1Id,
        timeSlot: {
          startTime: "2024-12-22T01:00:00Z",
          endTime: "2024-12-22T02:00:00Z",
        },
      });
    if (!bookA2.ok) {
      throw new Error(`Step 7 Failed- ${bookA2.body.error}`);
    }
    console.log("Step 7 Complete --> A2 books appointment with P1.");

    const cancelA1 = await request(app)
      .delete(`/api/appointments/cancelappointment/${appointmentId}`)
      .set("Authorization", `Bearer ${P1Token}`);
    if (!cancelA1.ok) {
      throw new Error(`Step 8 Failed- ${cancelA1.body.error}`);
    }
    console.log("Step 8 Complete --> P1 cancels appointment with A1.");

    const appointmentsA1 = await request(app)
      .get("/api/appointments/getappointment")
      .set("Authorization", `Bearer ${A1Token}`);
    if (appointmentsA1.body.appointments?.length !== 0) {
      throw new Error(`Step 9  Failed- ${appointmentsA1.body.error}`);
    }
    console.log("Step 9 Complete --> A1 confirms no pending appointments.");

    console.log("E2E Test Completed Successfully!");
  } catch (error) {
    console.error("E2E Test Failed:", error.message);
  } finally {
    try {
      console.log("Cleaning up test data...");
      await mongoose.connection.db.collection("users").deleteMany({});
      await mongoose.connection.db.collection("availabilities").deleteMany({});
      await mongoose.connection.db.collection("appointments").deleteMany({});
      console.log("Test data cleaned up.");
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError.message);
    }
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
};

e2eTestCase();
