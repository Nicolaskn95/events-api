# 📅 Events API - Backend

API RESTful para gerenciamento de eventos desenvolvida com Node.js, Express e MongoDB

## 👥 Integrantes

- Nicolas Katsuji Nagano
- Matheus Tadao Momiy

## 🛠️ Tecnologias Utilizadas

- **Backend**: Node.js 18+, Express.js
- **Banco de Dados**: MongoDB
- **Validação**: express-validator

## 🔗 Links Importantes

- **Frontend**:
  - [Repositório GitHub](https://github.com/Nicolaskn95/events-web)
  - [Aplicação Web](https://events-web-eta.vercel.app)
- **Backend**:
  - [Repositório GitHub](https://github.com/Nicolaskn95/events-api)
  - [API Pública](https://events-api-fatec.vercel.app/)

## 📊 Modelo de Dados

```javascript
{
  title: String,       // Título do evento (obrigatório)
  date: Date,         // Data e hora do evento (obrigatório)
  capacity: Number,    // Capacidade máxima de participantes
  ticketPrice: Number, // Preço do ingresso
  location: String,    // Local do evento (obrigatório)
  description: String, // Descrição detalhada
  createdAt: Date,     // Data de criação
  updatedAt: Date      // Data de atualização
}
```

## 🌐 Endpoints

### Eventos

| Método | Endpoint             | Descrição                    |
| ------ | -------------------- | ---------------------------- |
| GET    | `/api/events`        | Lista todos os eventos       |
| GET    | `/api/events/search` | Busca com filtros avançados  |
| GET    | `/api/events/:id`    | Obtém um evento específico   |
| POST   | `/api/events`        | Cria um novo evento          |
| PUT    | `/api/events/:id`    | Atualiza um evento existente |
| DELETE | `/api/events/:id`    | Remove um evento             |

## 📝 Exemplos de Requisições

### 📌 Criar Evento

```http
POST /api/events
Content-Type: application/json

{
  "title": "Workshop de Node.js",
  "date": "2024-06-15T14:00:00Z",
  "capacity": 50,
  "ticketPrice": 99.90,
  "location": "Sala 101 - Fatec",
  "description": "Workshop prático de Node.js para iniciantes"
}
```
