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

export const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const db = req.app.locals.db
    let user = await db.collection("users").find({ email }).limit(1).toArray()

    if (!user.length) {
      return res.status(400).json({
        error: [
          {
            value: `${email}`,
            msg: `Email ${email} não está cadastrado`,
            param: "email",
          },
        ],
      })
    }

    const isMatch = await bcrypt.compare(password, user[0].password)
    if (!isMatch) {
      return res.status(400).json({
        error: [
          {
            value: `${email}`,
            msg: `A senha informada está incorreta`,
            param: "password",
          },
        ],
      })
    }
    console.log(process.env.SECRET_KEY)
    jwt.sign(
      { user: { id: user[0]._id } },
      process.env.SECRET_KEY,
      { expiresIn: process.env.EXPIRES_IN },
      (err, token) => {
        if (err) throw err
        res.status(200).json({
          success: true,
          token,
        })
      }
    )

    return
  } catch (error) {
    console.error("Error fetching user:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}
