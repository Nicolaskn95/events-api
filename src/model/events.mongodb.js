use("eventDB")
db.insertOne({
  title: "Sample Event Title",
  date: new Date("2023-10-01T10:00:00Z"), // ISO8601 format
  capacity: 100, // Integer greater than or equal to 1
  ticketPrice: 0, // Float greater than or equal to 0
  location: "Sorocaba SP",
  description:
    "This is a sample event description with at least 10 characters.",
})

use("eventDB")
db.events.find()
