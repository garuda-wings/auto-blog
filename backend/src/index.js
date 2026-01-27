require("dotenv").config();
const app = require("./app");
const { scheduleDailyArticle } = require("./services/articleJob");

const PORT = process.env.PORT || 5000;

console.log("=== Application startup ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("ENABLE_SCHEDULER:", process.env.ENABLE_SCHEDULER);
console.log("PORT:", PORT);
console.log("===========================");

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  if (
    process.env.NODE_ENV !== "test" &&
    process.env.ENABLE_SCHEDULER === "true"
  ) {
    scheduleDailyArticle();
    console.log("Daily article scheduler started");
  }
}
