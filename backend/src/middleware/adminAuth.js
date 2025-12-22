module.exports = function adminAuth(req, res, next) {
  const adminKey = req.get("x-admin-key");

  if (!process.env.ADMIN_API_KEY) {
    return res.status(500).json({ error: "Admin API key not configured" });
  }

  if (!adminKey || adminKey !== process.env.ADMIN_API_KEY) {  
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
};
