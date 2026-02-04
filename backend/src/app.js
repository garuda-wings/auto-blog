const express = require("express");
const cors =  require("cors");
const articlesRoutes = require("./routes/articles");
const healthRoutes = require("./routes/health");
const readyRoutes = require("./routes/ready");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "http://localhost:8080",
      "http://localhost",
      "http://98.93.67.19"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/articles", articlesRoutes);
app.use("/health", healthRoutes);
app.use("/ready", readyRoutes);

module.exports = app;
