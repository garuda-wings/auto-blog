const db = require('./db');

// Fetch all articles
async function getAllArticles() {
  const result = await db.query('SELECT * FROM articles ORDER BY created_at DESC');
  return result.rows;
}

// Fetch single article by ID
async function getArticleById(id) {
  const result = await db.query('SELECT * FROM articles WHERE id = $1', [id]);
  return result.rows[0];
}

// Create new article (for AI-generated content)
async function createArticle(title, content) {
  const result = await db.query(
    'INSERT INTO articles (title, content, created_at) VALUES ($1, $2, NOW()) RETURNING *',
    [title, content]
  );
  return result.rows[0];
}

async function getPaginatedArticles({ page, limit, search }) {
  const offset = (page - 1) * limit;

  const where = search ? `WHERE title ILIKE $1` : "";
  const params = [];
  if (search) params.push(`%${search}%`);

  // total count
  const countResult = await db.query(
    `SELECT COUNT(*) FROM articles ${where}`,
    params
  );

  // paginated items
   const itemsResult = await db.query(
    `
    SELECT
      id,
      title,
      created_at,
      COALESCE(LEFT(content, 220), '') || '…' AS excerpt
    FROM articles
    ${where}
    ORDER BY created_at DESC
    LIMIT $${params.length + 1}
    OFFSET $${params.length + 2}
    `,
    [...params, limit, offset]
  );

  return {
    total: Number(countResult.rows[0].count),
    items: itemsResult.rows,
  };
}
module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  getPaginatedArticles
};
