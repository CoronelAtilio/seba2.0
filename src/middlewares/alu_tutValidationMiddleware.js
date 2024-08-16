const { body } = require('express-validator');

const alu_tutValidationMiddleware = [
    body('apellido_alumno')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('nombre_alumno')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('fecha_nac_alumno')
        .notEmpty()
        .withMessage('Campo Obligatorio')
        .bail()
        .isDate()
        .withMessage('Debe ser una fecha válida'),
    body('email_alumno')
        .isEmail()
        .withMessage('Debe ser Email'),
    body('celular_alumno')
        .isMobilePhone()
        .withMessage('Debe ser número de celular'),
    body('direccion_alumno')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('dni_alumno')
        .notEmpty()
        .withMessage('Campo Obligatorio'),
    body('genero_alumno')
        .notEmpty()
        .withMessage('Campo Obligatorio'),

];

module.exports = alu_tutValidationMiddleware;
