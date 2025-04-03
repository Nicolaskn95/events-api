# Events API

This is a RESTful API for managing events built with Node.js, Express, and MongoDB.

## Features

- Complete CRUD operations for events
- Data validation using express-validator
- Complex MongoDB queries with logical operators
- MongoDB integration with Mongoose

## Event Schema

The Event model includes the following attributes:
- title (String)
- date (Date)
- capacity (Integer)
- ticketPrice (Decimal)
- location (String)
- description (String)

## API Endpoints

### GET /api/events
Retrieves all events

### GET /api/events/search
Complex search with multiple conditions:
- Events within the next 3 months
- Capacity >= 100 OR ticket price <= $50

### GET /api/events/:id
Retrieves a specific event by ID

### POST /api/events
Creates a new event

### PUT /api/events/:id
Updates an existing event

### DELETE /api/events/:id
Deletes an event

## REST Client Examples

```http
### Get all events
GET http://localhost:3000/api/events

### Get events with complex search
GET http://localhost:3000/api/events/search

### Get single event
GET http://localhost:3000/api/events/[event-id]

### Create new event
POST http://localhost:3000/api/events
Content-Type: application/json

{
  "title": "Tech Conference 2024",
  "date": "2024-03-15T09:00:00Z",
  "capacity": 200,
  "ticketPrice": 99.99,
  "location": "Convention Center",
  "description": "Annual technology conference featuring industry experts"
}

### Update event
PUT http://localhost:3000/api/events/[event-id]
Content-Type: application/json

{
  "title": "Updated Tech Conference 2024",
  "date": "2024-03-15T09:00:00Z",
  "capacity": 250,
  "ticketPrice": 129.99,
  "location": "Convention Center",
  "description": "Updated annual technology conference featuring industry experts"
}

### Delete event
DELETE http://localhost:3000/api/events/[event-id]
```

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. For development with auto-reload: `npm run dev`

## Environment Variables

Create a `.env` file with:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/events_db
```