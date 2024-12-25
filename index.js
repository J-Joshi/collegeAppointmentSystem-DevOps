import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/authRoute.js";
import availability from "./routes/availabilityRoute.js";
import appointment from "./routes/appointmentRoute.js";

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_DATABASE_URI, {
    authMechanism: "SCRAM-SHA-1",
    tls: true,
    tlsCAFile: "./global-bundle.pem",
  })
  .then(() => console.log("Connected to AWS DocumentDB"))
  .catch((err) => console.error("Error connecting to DocumentDB:", err));

app.use("/api/users", userRoutes);
app.use("/api/availability", availability);
app.use("/api/appointments", appointment);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

export default app;
