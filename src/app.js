// app.js
const express = require("express");
const connectDb = require("./config/dbConnection");
const routes = require("./routes/index");
const cors = require("cors");

const app = express();
const path = require("path");

//connect to the database
connectDb();

// Middleware setup
app.use(express.json({ limit: "10kb" }));
app.use(cors());

// Serve static HTML
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use(routes);

// Catch-all handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "Not Found",
    message: `Cannot find this  ${req.originalUrl} route`,
  });
});

module.exports = app;
