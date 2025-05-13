import jwt from "jsonwebtoken"

export default function authentication(req, res, next) {
  const token = req.header("access-token")
  if (!token) {
    return res
      .status(401)
      .json({ msg: "Acesso negado. É obrigatório o envio do token" })
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded.user
    next()
  } catch (error) {
    res.status(401).json({ msg: "Token inválido!" })
  }
}
