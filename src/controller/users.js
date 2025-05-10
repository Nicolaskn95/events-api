import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const createUser = async (req, res) => {
  req.body.avatar = `https://ui-avatars.com/api/?name=${req.body.name.replace(
    / /g,
    "+"
  )}&background=random`
  console.log(req.body)
  // bcrypt para criptgrafar a senha
  const salt = await bcrypt.genSalt(10)
  req.body.password = await bcrypt.hash(req.body.password, salt)
  const db = req.app.locals.db
  await db
    .collection("users")
    .insertOne(req.body)
    .then((result) => res.status(201).send(result))
    .catch((err) => res.status(400).json(err))

  // jsonwebtoken -> para gerar o JWT
}
