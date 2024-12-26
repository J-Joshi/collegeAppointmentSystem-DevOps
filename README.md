# College Appointment System

This is a Node.js backend application that allows **students** to book appointments with **professors**, and for professors to specify their **availability**.  
It uses **Amazon DocumentDB** as its database and is hosted on **AWS EC2**.

## Table of Contents
1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Project Structure](#project-structure)
---

## Features

1. **User Authentication**: Students and Professors can register/log in.
2. **Professors**: Can specify their availability (time slots) for appointments.
3. **Students**: Can view a professor’s available time slots and book an appointment.
4. **Multiple Bookings**: Different students can book different time slots with the same professor.
5. **AWS DocumentDB**: Data is stored in a managed MongoDB-compatible database.
6. **AWS EC2**: Node.js code is deployed on an AWS EC2 instance.

---

## Tech Stack

- **Node.js** (Backend runtime)
- **Express.js** (Web framework)
- **Mongoose** (ODM for MongoDB/DocumentDB)
- **AWS**:
  - **DocumentDB** (database)
  - **EC2** (for hosting the Node.js server)
- **Nodemon** (for local development)
- **JWT** (for authentication)

## Project Structure

- **controllers/**: Business logic for each resource (auth, availability, appointment, getDataBase).
- **middleware/**: Express middleware (e.g., authentication).
- **models/**: Mongoose schemas/models for users, availability, appointments.
- **routes/**: Express routes that define endpoints.
- **index.js**: Main entry point to start the server.
- **.env**: Environment variables 
- **README.md**: Project documentation.

---
