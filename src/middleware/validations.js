import { check, validationResult, body } from "express-validator"

//Middleware para verificar os resultados da validação
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: true,
      message: "Erro de validação",
      errors: errors.array(),
    })
  }
  next()
}

export const validateEvent = [
  body("title")
    .notEmpty()
    .withMessage("O título é obrigatório.")
    .trim()
    .isLength({ min: 3 })
    .withMessage("O título deve ter pelo menos 3 caracteres."),

  body("date")
    .isISO8601()
    .withMessage("A data deve estar em formato ISO8601.")
    .toDate(),

  body("capacity")
    .isInt({ min: 1 })
    .withMessage("A capacidade deve ser um número inteiro maior ou igual a 1."),

  body("ticketPrice")
    .isFloat({ min: 0 })
    .withMessage("O preço do ingresso deve ser um número maior ou igual a 0."),

  body("location")
    .notEmpty()
    .withMessage("A localização é obrigatória.")
    .trim(),

  body("description")
    .notEmpty()
    .withMessage("A descrição é obrigatória.")
    .trim()
    .isLength({ min: 10 })
    .withMessage("A descrição deve ter pelo menos 10 caracteres."),

  validateRequest,
]

export const validateUser = [
  check("name")
    .not()
    .isEmpty()
    .withMessage("É obrigatório informa o nome")
    .isAlpha("pt-BR", { ignore: " " })
    .withMessage("O nome deve conter apenas letras e espaços")
    .isLength({ min: 3 })
    .withMessage("O nome deve ter pelo menos 3 caracteres")
    .isLength({ max: 100 })
    .withMessage("O nome deve ter no máximo 100 caracteres"),

  check("email")
    .notEmpty()
    .withMessage("O email é obrigatório.")
    .isEmail()
    .withMessage("O email deve ser válido.")
    .normalizeEmail(),
  // .custom(async (value, { req }) => {
  //   const db = req.app.locals.db
  //   const usersCollection = db.collection("users")
  //   return await usersCollection
  //     .find({ email: { $eq: value } })
  //     .toArray()
  //     .then((email) => {
  //       if (email.length && !req.params.id) {
  //         return Promise.reject(`O email ${value} já está em existe.`)
  //       }
  //     })
  // })
  check("password")
    .notEmpty()
    .withMessage("A senha é obrigatória.")
    .isLength({ min: 6 })
    .withMessage("A senha deve ter pelo menos 6 caracteres.")
    .isStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "A senha deve conter pelo menos uma letra minúscula, uma letra maiúscula, um número e um símbolo."
    ),

  check("active")
    .default(true)
    .isBoolean()
    .withMessage("O campo 'active' deve ser um valor booleano."),

  check("type")
    .notEmpty()
    .withMessage("O tipo de usuário é obrigatório.")
    .isIn(["customer", "admin"])
    .withMessage("O tipo de usuário deve ser 'Cliente' ou 'Admin'."),

  check("avatar")
    .optional({ nullable: true })
    .isURL()
    .withMessage("O avatar deve ser uma URL válida."),

  validateRequest,
]
