const express = require("express");
const router = express.Router();
const db = require("../models/db");

router.get("/", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.status(200).json({
      status: "ready",
      database: "ok",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Readiness check failed:", err.message);
    res.status(503).json({
      status: "not_ready",
      database: "unreachable",
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
