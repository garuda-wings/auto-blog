const app = require("./app");
const { scheduleDailyArticle } = require("./services/articleJob");

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  try {
    scheduleDailyArticle();
    console.log("Daily article scheduler started");
  } catch (err) {
    console.error("Failed to start daily article scheduler:", err);
  }
}