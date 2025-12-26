// backend/src/models/initDb.js
const fs = require("fs");
const path = require("path");
const db = require("./db");

async function initDb() {
  const schemaPath = path.join(__dirname, "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");

  console.log("Running database schema...");
  await db.query(schema);
  console.log("Schema applied successfully.");
}

module.exports = initDb;
