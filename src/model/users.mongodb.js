use("eventDB")
db.users.insertOne({
  nome: "Nicolas Nagano",
  email: "nicolasjap@hotmail.com",
  password: "123456",
  active: true,
  type: "customer",
  avatar: "https://ui-avatars.com/api/?name=Nicolas+Nagano&background=random",
})

db.users.createIndex({ email: 1 }, { unique: true })

db.users.find({}, { password: 0 })

use("eventDB")
db.users.insertOne({
  nome: "Maria Silva",
  email: "mariasilva",
  password: "1234",
  active: true,
  type: "admin",
  avatar: "https://ui-avatars.com/api/?name=Nicolas+Nagano&background=random",
})
