-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-10-2024 a las 18:55:12
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `seba`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `idalumno` int(10) UNSIGNED NOT NULL,
  `dni_alumno` varchar(15) NOT NULL,
  `email_alumno` varchar(100) DEFAULT NULL,
  `celular_alumno` varchar(15) DEFAULT NULL,
  `apellido_alumno` varchar(100) NOT NULL,
  `nombre_alumno` varchar(100) NOT NULL,
  `direccion_alumno` varchar(100) NOT NULL,
  `fecha_nac_alumno` date NOT NULL,
  `fk_idtutor_alumno` int(10) UNSIGNED DEFAULT NULL,
  `fk_idgenero_alumno` int(10) UNSIGNED NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado_alumno` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos`
--

CREATE TABLE `cargos` (
  `idcargo` int(10) UNSIGNED NOT NULL,
  `nombre_cargo` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `idcurso` int(10) UNSIGNED NOT NULL,
  `anio_curso` varchar(15) NOT NULL,
  `division_curso` varchar(15) NOT NULL,
  `estado_curso` int(1) NOT NULL,
  `fk_idturno_curso` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
--

CREATE TABLE `docentes` (
  `iddocente` int(10) UNSIGNED NOT NULL,
  `dni_docente` varchar(15) NOT NULL,
  `email_docente` varchar(100) DEFAULT NULL,
  `celular_docente` varchar(15) DEFAULT NULL,
  `apellido_docente` varchar(100) NOT NULL,
  `nombre_docente` varchar(100) NOT NULL,
  `fecha_nac_docente` date NOT NULL,
  `fk_idcargo_docente` int(10) UNSIGNED DEFAULT NULL,
  `fk_idsituacion_docente` int(10) UNSIGNED DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado_docente` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `idgenero` int(10) UNSIGNED NOT NULL,
  `nombre_genero` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

CREATE TABLE `materias` (
  `idmateria` int(10) UNSIGNED NOT NULL,
  `nombre_materia` varchar(100) NOT NULL,
  `estado_materia` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias_cursos`
--

CREATE TABLE `materias_cursos` (
  `idmateriacurso` int(10) UNSIGNED NOT NULL,
  `fk_iddocente_materiacurso` int(10) UNSIGNED DEFAULT NULL,
  `fk_idcurso_materiacurso` int(10) UNSIGNED DEFAULT NULL,
  `fk_idmateria_materiacurso` int(10) UNSIGNED DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado_materiacurso` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notas`
--

CREATE TABLE `notas` (
  `idnota` int(10) UNSIGNED NOT NULL,
  `fk_idalumno_nota` int(10) UNSIGNED NOT NULL,
  `fk_idmateriacurso_nota` int(10) UNSIGNED NOT NULL,
  `nota1_nota` decimal(2,2) DEFAULT NULL,
  `nota2_nota` decimal(2,2) DEFAULT NULL,
  `nota3_nota` decimal(2,2) DEFAULT NULL,
  `notadic_nota` decimal(2,2) DEFAULT NULL,
  `notafeb_nota` decimal(2,2) DEFAULT NULL,
  `notadef_nota` decimal(2,2) DEFAULT NULL,
  `obs_nota` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ciclo_lectivo_nota` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `idrol` int(10) UNSIGNED NOT NULL,
  `nombre_rol` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `situaciones`
--

CREATE TABLE `situaciones` (
  `idsituacion` int(10) UNSIGNED NOT NULL,
  `nombre_situacion` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `idturno` int(10) UNSIGNED NOT NULL,
  `nombre_turno` varchar(15) NOT NULL,
  `estado_turno` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tutores`
--

CREATE TABLE `tutores` (
  `idtutor` int(10) UNSIGNED NOT NULL,
  `dni_tutor` varchar(15) NOT NULL,
  `email_tutor` varchar(100) DEFAULT NULL,
  `celular_tutor` varchar(15) DEFAULT NULL,
  `apellido_tutor` varchar(100) DEFAULT NULL,
  `nombre_tutor` varchar(100) DEFAULT NULL,
  `direccion_tutor` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado_tutor` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `idusuario` int(10) UNSIGNED NOT NULL,
  `password_usuario` varchar(100) NOT NULL,
  `nombre_usuario` varchar(100) NOT NULL,
  `fk_iddocente_usuario` int(10) UNSIGNED DEFAULT NULL,
  `fk_idrol_usuario` int(10) UNSIGNED NOT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado_usuario` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`idalumno`),
  ADD UNIQUE KEY `dni_alumno` (`dni_alumno`),
  ADD UNIQUE KEY `email_alumno` (`email_alumno`),
  ADD UNIQUE KEY `celular_alumno` (`celular_alumno`),
  ADD KEY `fk_idtutor_alumno` (`fk_idtutor_alumno`),
  ADD KEY `fk_idgenero_alumno` (`fk_idgenero_alumno`);

--
-- Indices de la tabla `cargos`
--
ALTER TABLE `cargos`
  ADD PRIMARY KEY (`idcargo`),
  ADD UNIQUE KEY `nombre_cargo` (`nombre_cargo`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`idcurso`),
  ADD KEY `fk_idturno_curso` (`fk_idturno_curso`);

--
-- Indices de la tabla `docentes`
--
ALTER TABLE `docentes`
  ADD PRIMARY KEY (`iddocente`),
  ADD UNIQUE KEY `dni_docente` (`dni_docente`),
  ADD UNIQUE KEY `email_docente` (`email_docente`),
  ADD UNIQUE KEY `celular_docente` (`celular_docente`),
  ADD KEY `fk_idsituacion_docente` (`fk_idsituacion_docente`),
  ADD KEY `fk_idcargo_docente` (`fk_idcargo_docente`);

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`idgenero`),
  ADD UNIQUE KEY `nombre_genero` (`nombre_genero`);

--
-- Indices de la tabla `materias`
--
ALTER TABLE `materias`
  ADD PRIMARY KEY (`idmateria`),
  ADD UNIQUE KEY `nombre_materia` (`nombre_materia`);

--
-- Indices de la tabla `materias_cursos`
--
ALTER TABLE `materias_cursos`
  ADD PRIMARY KEY (`idmateriacurso`),
  ADD UNIQUE KEY `unique_fk` (`fk_idcurso_materiacurso`,`fk_idmateria_materiacurso`),
  ADD KEY `fk_idmateria_materiacurso` (`fk_idmateria_materiacurso`),
  ADD KEY `fk_idcurso_materiacurso` (`fk_idcurso_materiacurso`),
  ADD KEY `fk_iddocente_materiacurso` (`fk_iddocente_materiacurso`);

--
-- Indices de la tabla `notas`
--
ALTER TABLE `notas`
  ADD PRIMARY KEY (`idnota`),
  ADD UNIQUE KEY `alumno_materiacurso` (`fk_idalumno_nota`,`fk_idmateriacurso_nota`),
  ADD KEY `fk_idalumno_nota` (`fk_idalumno_nota`),
  ADD KEY `fk_idmateriacurso_nota` (`fk_idmateriacurso_nota`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`idrol`),
  ADD UNIQUE KEY `nombre_rol` (`nombre_rol`);

--
-- Indices de la tabla `situaciones`
--
ALTER TABLE `situaciones`
  ADD PRIMARY KEY (`idsituacion`),
  ADD UNIQUE KEY `nombre_situacion` (`nombre_situacion`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`idturno`),
  ADD UNIQUE KEY `nombre_turno` (`nombre_turno`);

--
-- Indices de la tabla `tutores`
--
ALTER TABLE `tutores`
  ADD PRIMARY KEY (`idtutor`),
  ADD UNIQUE KEY `dni_tutor` (`dni_tutor`),
  ADD UNIQUE KEY `email_tutor` (`email_tutor`),
  ADD UNIQUE KEY `celular_tutor` (`celular_tutor`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idusuario`),
  ADD UNIQUE KEY `nombre_usuario` (`nombre_usuario`),
  ADD KEY `fk_idrol_usuario` (`fk_idrol_usuario`),
  ADD KEY `fk_iddocente_usuario` (`fk_iddocente_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `idalumno` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cargos`
--
ALTER TABLE `cargos`
  MODIFY `idcargo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `idcurso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `docentes`
--
ALTER TABLE `docentes`
  MODIFY `iddocente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `idgenero` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `idmateria` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `materias_cursos`
--
ALTER TABLE `materias_cursos`
  MODIFY `idmateriacurso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notas`
--
ALTER TABLE `notas`
  MODIFY `idnota` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `idrol` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `situaciones`
--
ALTER TABLE `situaciones`
  MODIFY `idsituacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `idturno` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tutores`
--
ALTER TABLE `tutores`
  MODIFY `idtutor` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idusuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `fk_idgenero_alumno` FOREIGN KEY (`fk_idgenero_alumno`) REFERENCES `generos` (`idgenero`),
  ADD CONSTRAINT `fk_idtutor_alumno` FOREIGN KEY (`fk_idtutor_alumno`) REFERENCES `tutores` (`idtutor`);

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `fk_idturno_curso` FOREIGN KEY (`fk_idturno_curso`) REFERENCES `turnos` (`idturno`);

--
-- Filtros para la tabla `docentes`
--
ALTER TABLE `docentes`
  ADD CONSTRAINT `fk_idcargo_docente` FOREIGN KEY (`fk_idcargo_docente`) REFERENCES `cargos` (`idcargo`),
  ADD CONSTRAINT `fk_idsituacion_docente` FOREIGN KEY (`fk_idsituacion_docente`) REFERENCES `situaciones` (`idsituacion`);

--
-- Filtros para la tabla `materias_cursos`
--
ALTER TABLE `materias_cursos`
  ADD CONSTRAINT `fk_idcurso_materiacurso` FOREIGN KEY (`fk_idcurso_materiacurso`) REFERENCES `cursos` (`idcurso`),
  ADD CONSTRAINT `fk_iddocente_materiacurso` FOREIGN KEY (`fk_iddocente_materiacurso`) REFERENCES `docentes` (`iddocente`),
  ADD CONSTRAINT `fk_idmateria_materiacurso` FOREIGN KEY (`fk_idmateria_materiacurso`) REFERENCES `materias` (`idmateria`);

--
-- Filtros para la tabla `notas`
--
ALTER TABLE `notas`
  ADD CONSTRAINT `fk_idalumno_nota` FOREIGN KEY (`fk_idalumno_nota`) REFERENCES `alumnos` (`idalumno`),
  ADD CONSTRAINT `fk_idmateriacurso_nota` FOREIGN KEY (`fk_idmateriacurso_nota`) REFERENCES `materias_cursos` (`idmateriacurso`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `fk_iddocente_usuario` FOREIGN KEY (`fk_iddocente_usuario`) REFERENCES `docentes` (`iddocente`),
  ADD CONSTRAINT `fk_idrol_usuario` FOREIGN KEY (`fk_idrol_usuario`) REFERENCES `roles` (`idrol`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
