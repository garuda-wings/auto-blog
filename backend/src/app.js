const express = require("express");
const cors =  require("cors");
const articlesRoutes = require("./routes/articles");
const healthRoutes = require("./routes/health");
const readyRoutes = require("./routes/ready");

const app = express();

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/articles", articlesRoutes);
app.use("/health", healthRoutes);
app.use("/ready", readyRoutes);

module.exports = app;
