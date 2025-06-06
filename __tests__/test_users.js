const request = require("supertest");
const dotenv = require("dotenv");

dotenv.config();

const baseUrl = "http://localhost:3001";

describe("Testes na Api de Usuários sem o token de autenticação", () => {
  it("POST/ Registro de novo usuário", async () => {
    const response = await request(baseUrl)
      .post("/api/users/register")
      .set("Content-Type", "application/json")
      .send({
        name: "Test User",
        email: "testuser@test.com",
        password: "Test@123",
      })
      .expect(201);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Usuário criado com sucesso"
    );
  });

  it("POST/ Login de usuário com credenciais inválidas", async () => {
    const response = await request(baseUrl)
      .post("/api/users/login")
      .set("Content-Type", "application/json")
      .send({
        email: "nonexistent@test.com",
        password: "wrongpassword",
      })
      .expect(400);

    expect(response.body).toHaveProperty("error");
  });

  it("GET/ Tentativa de obter usuário sem token", async () => {
    const response = await request(baseUrl)
      .get("/api/users/")
      .set("Content-Type", "application/json")
      .expect(401);
  });
});

describe("Testes na Api de Usuários com o token de autenticação", () => {
  let token;
  let userId;

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

  it("GET/ Obter dados do usuário", async () => {
    const response = await request(baseUrl)
      .get("/api/users/")
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .expect(200);

    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("name");
    expect(response.body.user).toHaveProperty("email");
    expect(response.body.user).toHaveProperty("avatar");
  });

  it("PUT/ Atualizar dados do usuário", async () => {
    const response = await request(baseUrl)
      .put("/api/users/")
      .set("Content-Type", "application/json")
      .set("access_token", token)
      .send({
        name: "Updated Test User",
        email: "testuser@test.com",
      })
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Usuário atualizado com sucesso"
    );
    expect(response.body).toHaveProperty("data");
  });

  it("DELETE/ Deletar usuário", async () => {
    const response = await request(baseUrl)
      .delete("/api/users/")
      .set("Content-Type", "application/json")
      .set("access-token", token)
      .expect(200);

    expect(response.body).toHaveProperty("success", true);
    expect(response.body).toHaveProperty(
      "message",
      "Usuário deletado com sucesso"
    );
  });
});
