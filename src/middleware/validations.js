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
