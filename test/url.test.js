const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");

require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/shoturl/:shorturl", () => {
  test("It should redirect to an valid url", async () => {
    const response = await request(app).get("/api/shorturl/381782");
    expect(response.statusCode).toBe(302);
    expect(response.redirect).toBe(true);
  });
});

describe("POST /api/shoturl", () => {
  test("It should create a valid short url", async () => {
    const url = "http://www.example.com";
    const response = await request(app).post("/api/shorturl").send({ url });
    expect(response.statusCode).toBe(200);
    expect(response.body.original_url).toBe(url);
  });
});

describe("POST /api/shoturl", () => {
  test("It should response with an invalid message", async () => {
    const response = await request(app)
      .post("/api/shorturl")
      .send({ url: "http://www.example" });
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe("invalid url");
  });
});
