const { body } = require('express-validator');

const loginValidationMiddleware = [
    body('loginUser')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('loginPass')
        .notEmpty()
        .withMessage('Campo Obligatorio')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Contraseña inválida')
];

module.exports = loginValidationMiddleware;
