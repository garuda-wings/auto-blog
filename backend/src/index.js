const express = require("express");
const articleRoutes = require("./routes/articles");
const { scheduleDailyArticle } = require("./services/articleJob");
const cors = require("cors");

const app = express();

// Enable CORS for frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Parse JSON bodies
app.use(express.json());

// Mount article routes
app.use("/articles", articleRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Start daily AI article generation without crashing the server
try {
  scheduleDailyArticle();
  console.log("Daily article scheduler started");
} catch (err) {
  console.error("Failed to start daily article scheduler:", err);
}
