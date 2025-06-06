const request = require("supertest");
const dotenv = require("dotenv");
const { ObjectId } = require("mongodb");

dotenv.config();

const baseUrl = "http://localhost:3001";

describe("Testes na Api de Eventos sem o token de autenticação", () => {
  it("GET/ Lista todos os eventos sem o token", async () => {
    const response = await request(baseUrl)
      .get("/api/events/")
      .set("Content-Type", "application/json")
      .expect(401);
  });

  it("GET/ Lista todos os eventos pelo ID sem o token", async () => {
    const response = await request(baseUrl)
      .get("/api/events/665a9b1b34c3f52d6f21c3d5")
      .set("Content-Type", "application/json")
      .expect(401);
  });

  it("POST/ Criar evento sem o token", async () => {
    const response = await request(baseUrl)
      .post("/api/events/")
      .set("Content-Type", "application/json")
      .send({
        title: "Test Event",
        description: "Test Description",
        date: "2024-03-20",
        location: "Test Location",
        capacity: 100,
        ticketPrice: 50.0,
      })
      .expect(401);
  });
});

describe("Testes na Api de Eventos com o token de autenticação", () => {
  let token;
  let eventId;

  beforeAll(async () => {
    // Primeiro, criar um usuário
    const registerResponse = await request(baseUrl)
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        name: "Test User",
        email: "testuser@test.com",
        password: "Test@123",
      });

    // Depois, fazer login para obter o token
    const loginResponse = await request(baseUrl)
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: "testuser@test.com",
        password: "Test@123",
      });

    token = loginResponse.body.token;
    expect(token).toBeDefined();
  });

  it("POST/ Criar novo evento", async () => {
    const response = await request(baseUrl)
      .post("/api/events/")
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .send({
        title: "Test Event",
        description:
          "This is a test event description that is long enough to meet the minimum length requirement",
        date: "2024-03-20T00:00:00.000Z",
        location: "Test Location",
        capacity: 100,
        ticketPrice: 50.0,
      })
      .expect(201);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Event created successfully"
    );
    expect(response.body).toHaveProperty("data");
    eventId = response.body.data.toString(); // Convert ObjectId to string
  });

  it("GET/ Lista todos os eventos", async () => {
    const response = await request(baseUrl)
      .get("/api/events/")
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it("GET/ Busca eventos por termo", async () => {
    const response = await request(baseUrl)
      .get("/api/events/search?q=Test")
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("data");
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("GET/ Obtém evento por ID", async () => {
    const response = await request(baseUrl)
      .get(`/api/events/${eventId}`)
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .expect(200);

    expect(response.body).toHaveProperty("title", "Test Event");
    expect(response.body).toHaveProperty("description");
    expect(response.body).toHaveProperty("date");
    expect(response.body).toHaveProperty("location", "Test Location");
    expect(response.body).toHaveProperty("capacity", 100);
    expect(response.body).toHaveProperty("ticketPrice", 50.0);
  });

  it("PUT/ Atualiza evento", async () => {
    // First verify the event exists
    const getResponse = await request(baseUrl)
      .get(`/api/events/${eventId}`)
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .expect(200);

    expect(getResponse.body).toBeDefined();

    // Then try to update it
    const response = await request(baseUrl)
      .put(`/api/events/${eventId}`)
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .send({
        title: "Updated Test Event",
        description:
          "This is an updated test event description that is long enough to meet the minimum length requirement",
        date: "2024-03-21T00:00:00.000Z",
        location: "Updated Test Location",
        capacity: 150,
        ticketPrice: 75.0,
      })
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty("data");
    expect(response.body.data).toHaveProperty("title", "Updated Test Event");
  });

  it("DELETE/ Remove evento", async () => {
    const response = await request(baseUrl)
      .delete(`/api/events/${eventId}`)
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Event deleted successfully"
    );
  });
});
