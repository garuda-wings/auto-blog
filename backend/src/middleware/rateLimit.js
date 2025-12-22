const rateLimit = require("express-rate-limit");

const aiGenerationLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 5, // max 5 generations per IP per day
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "AI generation limit reached. Try again later."
  },
  skip: ()=> process.env.NODE_ENV === "test"
});

module.exports = { aiGenerationLimiter };
