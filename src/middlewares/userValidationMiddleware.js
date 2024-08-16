const { body } = require('express-validator');

const userValidationMiddleware = [
    body('nombre_usuario')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('password_usuario')
        .notEmpty()
        .withMessage('Campo Obligatorio')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Contraseña inválida'),
    body('password_usuario2')
        .notEmpty()
        .withMessage('Campo Obligatorio')
        .bail()
        .isLength({ min: 3 })
        .withMessage('Contraseña inválida'),
    body('permisos')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('dni_docente')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
];

module.exports = userValidationMiddleware;
