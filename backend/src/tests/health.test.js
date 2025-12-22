const request = require("supertest");
const app = require("../app");
const { getPaginatedArticles, getArticleById } = require("../models/articleModel");

// Mock the Article model
jest.mock("../models/articleModel", () => ({
  getPaginatedArticles: jest.fn().mockResolvedValue({
    total: 0,
    items: [],
  }),
  
  getArticleById: jest.fn().mockResolvedValue({
    id: 1,
    title: "Test Article",
    content: "Test Content",
    created_at: new Date(),
  }),
}));

describe("Backend health check", () => {
  it("GET /articles should return 200", async () => {
    const res = await request(app).get("/articles");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("items");
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it("GET /articles/:id should return an article", async () => {
    const res = await request(app).get("/articles/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", 1);
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("content");
  });

  it("GET /articles/:id should return 404 when article is not found", async () => {
    const Article = require("../models/articleModel");

    // Simulate DB returning no article
    Article.getArticleById.mockResolvedValue(null);

    const res = await request(app).get("/articles/9999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("error");
  })
});

