const app = require("./app");
const { scheduleDailyArticle } = require("./services/articleJob");
const initDb = require("./models/initDb");

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  (async () => {
    try {
      await initDb();

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
    } catch (err) {
      console.error("Fatal startup error:", err);
      process.exit(1);
    }
  })();
}
