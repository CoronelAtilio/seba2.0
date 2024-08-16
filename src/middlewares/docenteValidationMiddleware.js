const { body } = require('express-validator');

const docenteValidationMiddleware = [
    body('apellido_docente')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('fecha_nac_docente')
        .notEmpty()
        .withMessage('Campo Obligatorio')
        .bail()
        .isDate()
        .withMessage('Debe ser una fecha válida'),
    body('email_docente')
        .isEmail()
        .withMessage('Debe ser Email'),
    body('celular_docente')
        .isMobilePhone()
        .withMessage('Debe ser número de celular'),
    body('nombre_cargo')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('dni_docente')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('condicion')
        .notEmpty()
        .withMessage('Campo Obligatorio')
];

module.exports = docenteValidationMiddleware;
