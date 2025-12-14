// backend/src/models/seed.js
const db = require('./db');

async function seed() {
  try {
    console.log("Checking for existing articles...");

    const check = await db.query('SELECT COUNT(*) AS count FROM articles');
    const count = parseInt(check.rows[0].count, 10);

    if (count > 0) {
      console.log(`Database already has ${count} article(s). Skipping seeding.`);
      process.exit(0);
    }

    console.log("Seeding database with initial articles...");

    await db.query(
      `INSERT INTO articles (title, content)
       VALUES
        ($1, $2),
        ($3, $4),
        ($5, $6);`,
      [
        'Welcome to AutoBlog',
        'This is the first article in your auto-generated blog.',
        'Automation Rocks',
        'This blog will eventually generate articles automatically using AI.',
        'Getting Started',
        'Your setup is almost complete. This article prepares your environment.'
      ]
    );

    console.log("Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding DB:", err);
    process.exit(1);
  }
}

seed();
