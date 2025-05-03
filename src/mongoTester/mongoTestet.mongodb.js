use("eventDB")
db.events.find({ date: { $eq: new Date("2024-05-15") } }).pretty()
