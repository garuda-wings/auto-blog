// src/tests/articles.gen.test.js
process.env.ADMIN_API_KEY = "test-admin-key";
process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require("../app"); // your Express app
const Article = require("../models/articleModel");
const { generateArticle } = require("../services/aiClient");

const adminRequest = () =>
  request(app)
    .post("/articles/gen")
    .set("x-admin-key", process.env.ADMIN_API_KEY);

jest.mock("../models/articleModel");
jest.mock("../services/aiClient");

describe("POST /articles/gen", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("should return 200 and save the article when AI generates valid data", async () => {
    generateArticle.mockResolvedValue({
      title: "Valid title",
      content: "Valid content that is long enough to pass validation."
    });

    Article.createArticle.mockResolvedValue({
      id: 1,
      title: "Valid title",
      content: "Valid content that is long enough to pass validation."
    });

    // const res = await request(app).post("/articles/gen");
    const res = await adminRequest();

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(generateArticle).toHaveBeenCalledTimes(1);
    expect(Article.createArticle).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if generated article has empty title", async () => {
    generateArticle.mockResolvedValue({
      title: "",
      content: "Valid content"
    });

    // const res = await request(app).post("/articles/gen");
    const res = await adminRequest();

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid article data generated");
  });

  it("should return 400 if generated article has empty content", async () => {
    generateArticle.mockResolvedValue({
      title: "Valid title",
      content: ""
    });

    // const res = await request(app).post("/articles/gen");
    const res = await adminRequest();

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid article data generated");
  });

  it("should return 400 if generated article has only whitespace content", async () => {
    generateArticle.mockResolvedValue({
      title: "Valid title",
      content: "     "
    });

    // const res = await request(app).post("/articles/gen");
    const res = await adminRequest();

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error", "Invalid article data generated");
  });

  it.skip("should return 429 when rate limit is exceeded", async () => {
    generateArticle.mockResolvedValue({
      title: "Test",
      content: "Test content"
    });

    for (let i = 0; i < 5; i++) {
      // await request(app).post("/articles/gen");
      const res = await adminRequest();
      expect(res.statusCode).toBe(200);
    }

    // const res = await request(app).post("/articles/gen");
    const res = await adminRequest();
    expect(res.statusCode).toBe(429);
    expect(res.body).toHaveProperty(
      "error",
      "AI generation limit reached. Try again later."
    );
  });

  // it("should return 500 if DB insertion fails", async () => {
  //   generateArticle.mockResolvedValue({
  //     title: "Valid title",
  //     content: "Valid content"
  //   });

  //   Article.createArticle.mockRejectedValueOnce(new Error("DB error"));

  //   // const res = await request(app).post("/articles/gen");
  //   const res = await adminRequest();

  //   expect(res.statusCode).toBe(500);
  //   expect(res.body).toHaveProperty("error", "AI generation failed");
  // });

  it("should return 500 if DB insertion fails", async () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => { });

    generateArticle.mockResolvedValue({
      title: "Valid title",
      content: "Valid content"
    });

    Article.createArticle.mockRejectedValueOnce(new Error("DB error"));

    const res = await adminRequest();

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "AI generation failed");

    spy.mockRestore();
  });

  it("should return 401 if admin key is missing", async () => {
    const res = await request(app).post("/articles/gen");

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("error", "Unauthorized");
  });
});
