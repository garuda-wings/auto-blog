// backend/src/models/initDb.js
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function init() {
  try {
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log("Running database schema...");
    await db.query(schema);

    console.log("Schema applied successfully.");
    process.exit(0);
  } catch (err) {
    console.error("Error applying schema:", err);
    process.exit(1);
  }
}

init();
