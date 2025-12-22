const express = require("express");
const cors =  require("cors");
const articlesRoutes = require("./routes/articles");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

app.use("/articles", articlesRoutes);

module.exports = app;
