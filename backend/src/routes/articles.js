const express = require('express');
const router = express.Router();
const Article = require('../models/articleModel');
const { generateArticle } = require('../services/aiClient');
const { aiGenerationLimiter } = require("../middleware/rateLimit")
const adminAuth = require("../middleware/adminAuth");


router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const result = await Article.getPaginatedArticles({
      page,
      limit,
      search,
    });

    res.json({
      page,
      limit,
      total: result.total,
      items: result.items,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch articles" });
  }
});

// GET /articles/:id - fetch one article by ID
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.getArticleById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch article" });
  }
});

// POST /articles/gen - generate a new article via AI and save
// router.post("/gen", aiGenerationLimiter,async (req, res) => {
//   try {
//     const articleData = await generateArticle();

//     // AI failed
//     if (!articleData) {
//       return res.status(500).json({ error: "AI generation failed" });
//     }

//     const { title, content } = articleData;

//     // Invalid article
//     if (!title?.trim() || !content?.trim()) {
//       return res
//         .status(400)
//         .json({ error: "Invalid article data generated" });
//     }

//     const savedArticle = await Article.createArticle(
//       title.trim(),
//       content.trim()
//     );

//     res.status(200).json(savedArticle);
//   } catch (err) {
//     console.error("AI generation endpoint error:", err);
//     res.status(500).json({ error: "AI generation failed" });
//   }
// });
router.post(
  "/gen",
  adminAuth,
  aiGenerationLimiter,
  async (req, res) => {
    try {
      const articleData = await generateArticle();

      if (
        !articleData ||
        !articleData.title ||
        !articleData.title.trim() ||
        !articleData.content ||
        !articleData.content.trim()
      ) {
        return res
          .status(400)
          .json({ error: "Invalid article data generated" });
      }

      const savedArticle = await Article.createArticle(
        articleData.title.trim(),
        articleData.content.trim()
      );

      res.json(savedArticle);
    } catch (err) {
      console.error("AI generation endpoint error:", err);
      res.status(500).json({ error: "AI generation failed" });
    }
  }
);

module.exports = router;
