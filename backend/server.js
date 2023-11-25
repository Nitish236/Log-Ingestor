require("express-async-errors");
require("dotenv").config();

const mongoose = require("mongoose");
const connectToDatabase = require("./database/connection");

const cookieParser = require("cookie-parser");
const cors = require("cors");

// Middlewares
const errorMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

// Routers
const logRoute = require("./routes/logRoute");
const queryRoute = require("./routes/queryRoute");

const express = require("express");
const app = express();
const server = require("http").createServer(app);

// Cors to allow only specific domains
app.use(
  cors({
    origin: [process.env.F_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", logRoute); // Ingestion route
app.use("/filter", queryRoute); // Query Route

app.use(errorMiddleware); // Middleware to handle all thrown errors
app.use(notFoundMiddleware); // Middleware to handle Routes that are not there

async function startServer() {
  try {
    // Function to connect to DB
    await connectToDatabase();

    console.log("Database connected");

    server.listen(process.env.PORT, () => {
      console.log(`App listening at http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error - " + error.message);

    await mongoose.connection.close();
    console.log("Database connection closed");

    console.log("Server is shutting down");
    process.exit();
  }
}

startServer();
