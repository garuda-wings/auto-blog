const cron = require("node-cron");
const { generateArticle } = require("./aiClient");
const Article = require("../models/articleModel");

// Run every day at 22:00 PM server time
const CRON_SCHEDULE = "0 22 * * *";

function scheduleDailyArticle() {
  if (process.env.NODE_ENV === "test") return;

  console.log("daily article scheduler initialized...");

  cron.schedule(CRON_SCHEDULE, async () => {
    console.log("Running daily article generation task...");

    try {
      const article = await generateArticle();

      if (
        !article ||
        !article.title ||
        !article.title.trim() ||
        !article.content ||
        !article.content.trim()
      ) {
        console.log("Daily generation failed: no article returned");
        return;
      }

      const saved = await Article.createArticle(
        article.title.trim(), 
        article.content.trim()
      );

      console.log("Daily AI article saved:", saved.id);
    } catch (error) {
      console.log("Daily article generation error:", error);
    }
  }, {
    timezone: "Europe/Madrid"
  });
}

// Temporary function for testing
async function runDailyArticleNow() {
  console.log("Running manual daily article task...");

  try {
    const article = await generateArticle();

    if (
      !article ||
      !article.title ||
      !article.title.trim() ||
      !article.content ||
      !article.content.trim()
    ) {
      console.error("Manual run failed: no article returned");
      return;
    }

    const saved = await Article.createArticle(article.title, article.content);
    console.log("Manual AI article saved:", saved.id);
  } catch (err) {
    console.error("Manual article generation error:", err);
  }
}


module.exports = { scheduleDailyArticle, runDailyArticleNow };
