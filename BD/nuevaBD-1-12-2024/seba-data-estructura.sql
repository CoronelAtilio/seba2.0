-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 01-12-2024 a las 15:00:10
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

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
CREATE DATABASE IF NOT EXISTS `seba` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `seba`;

DELIMITER $$
--
-- Procedimientos
--
DROP PROCEDURE IF EXISTS `relacion_materias_cursos`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `relacion_materias_cursos` (IN `materias` JSON, IN `cursos` JSON, OUT `valoresError` JSON)   BEGIN
    DECLARE materia INT;
    DECLARE curso INT;
    DECLARE i INT DEFAULT 0;
    DECLARE j INT DEFAULT 0;
    DECLARE existeCombinacion BOOLEAN;

    SET valoresError = JSON_ARRAY();

    -- Bucles para recorrer todas las combinaciones
    WHILE i < JSON_LENGTH(materias) DO
        SET materia = JSON_UNQUOTE(JSON_EXTRACT(materias, CONCAT('$[', i, ']')));
        SET j = 0;

        WHILE j < JSON_LENGTH(cursos) DO
            SET curso = JSON_UNQUOTE(JSON_EXTRACT(cursos, CONCAT('$[', j, ']')));

            -- Verificar si la combinación existe
            SET existeCombinacion = EXISTS (
                SELECT 1 FROM materias_cursos 
                WHERE fk_idmateria_materiacurso = materia 
                AND fk_idcurso_materiacurso = curso
            );

            IF existeCombinacion THEN
                -- Agregar la combinación existente a la salida
                SET valoresError = JSON_ARRAY_APPEND(valoresError, '$', JSON_OBJECT(
                    'materia', materia,
                    'curso', curso
                ));
            END IF;

            SET j = j + 1;
        END WHILE;

        SET i = i + 1;
    END WHILE;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
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

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`idalumno`, `dni_alumno`, `email_alumno`, `celular_alumno`, `apellido_alumno`, `nombre_alumno`, `direccion_alumno`, `fecha_nac_alumno`, `fk_idtutor_alumno`, `fk_idgenero_alumno`, `createdAt`, `updatedAt`, `estado_alumno`) VALUES
(1, '374283087730495', 'nshorte0@csmonitor.com', '5223427416', 'Shorte', 'Nate', '09 Prentice Crossing', '2010-12-24', NULL, 2, '2024-06-14 06:00:00', '2024-10-23 23:03:15', 1),
(2, '374288880568455', 'tdureden1@examiner.com', '7161999819', 'Dureden', 'Teresina', '96 Bluejay Road', '2010-01-04', NULL, 2, '2024-01-10 06:00:00', '0000-00-00 00:00:00', 1),
(3, '374283794894071', 'wrowen2@gmpg.org', '1333574726', 'Rowen', 'Westley', '85 1st Point', '2010-10-16', NULL, 1, '2024-06-05 06:00:00', '2023-10-02 06:00:00', 1),
(4, '374288935986256', 'wcasoni3@scribd.com', '1892643641', 'Casoni', 'Wandie', '12087 Arrowood Court', '2010-02-27', NULL, 2, '2024-08-01 06:00:00', '2023-10-22 06:00:00', 1),
(5, '374283750047847', 'dchaffer4@foxnews.com', '1397776531', 'Chaffer', 'Derrik', '762 Oak Valley Park', '2008-04-27', NULL, 1, '2024-06-10 06:00:00', '0000-00-00 00:00:00', 1),
(6, '374283463308544', 'emckaile5@miibeian.gov.cn', '6877153878', 'McKaile', 'Eva', '52 Fuller Junction', '2009-07-03', NULL, 2, '2024-06-17 06:00:00', '0000-00-00 00:00:00', 1),
(7, '374283152837308', 'mlocal6@imageshack.us', '4206872080', 'Local', 'Mehetabel', '98 Dahle Plaza', '2010-03-11', NULL, 2, '2024-03-06 06:00:00', '0000-00-00 00:00:00', 1),
(8, '374288962019922', 'homand7@netvibes.com', '8736251012', 'Omand', 'Hendrick', '7 Arizona Drive', '2009-12-16', NULL, 3, '2024-01-12 06:00:00', '0000-00-00 00:00:00', 1),
(9, '374283357723485', 'athraves8@imdb.com', '8272726911', 'Thraves', 'Angel', '836 Veith Place', '2009-07-21', NULL, 3, '2024-08-27 06:00:00', '0000-00-00 00:00:00', 1),
(10, '374283326778339', 'flefley9@mysql.com', '9381302007', 'Lefley', 'Finley', '79408 Burrows Lane', '2009-11-26', NULL, 1, '2024-09-14 06:00:00', '0000-00-00 00:00:00', 1),
(11, '374283606057206', 'hfreemantlea@baidu.com', '1452529203', 'Freemantle', 'Hurleigh', '0933 Packers Court', '2008-08-09', NULL, 2, '2024-05-09 06:00:00', '0000-00-00 00:00:00', 1),
(12, '374283085651859', 'esandbachb@csmonitor.com', '1336859761', 'Sandbach', 'Eric', '2285 Basil Park', '2010-02-25', NULL, 3, '2024-07-02 06:00:00', '0000-00-00 00:00:00', 1),
(13, '374288870093639', 'kjeppc@homestead.com', '3989962276', 'Jepp', 'Kippie', '36551 Grasskamp Trail', '2010-12-07', NULL, 2, '2024-08-22 06:00:00', '0000-00-00 00:00:00', 1),
(14, '374283538945874', 'pclaraed@cbsnews.com', '7856703092', 'Clarae', 'Packston', '1040 Eastwood Point', '2008-12-12', NULL, 3, '2024-01-29 06:00:00', '0000-00-00 00:00:00', 1),
(15, '374283990505737', 'ghaselupe@youku.com', '8538034368', 'Haselup', 'Gray', '014 Eastwood Plaza', '2009-03-03', NULL, 3, '2024-06-30 06:00:00', '0000-00-00 00:00:00', 1),
(16, '374288783287294', 'eperfectf@twitpic.com', '9595458713', 'Perfect', 'Easter', '43 Florence Junction', '2009-03-11', NULL, 1, '2024-03-04 06:00:00', '0000-00-00 00:00:00', 1),
(17, '374283058017757', 'dwildtg@gmpg.org', '6048320004', 'Wildt', 'Dionysus', '1 Rigney Crossing', '2010-09-06', NULL, 1, '2024-07-17 06:00:00', '2024-10-23 23:10:26', 1),
(18, '374288605500189', 'mstrobanh@wordpress.org', '8659364480', 'Stroban', 'Monique', '3 Morningstar Alley', '2008-06-04', NULL, 3, '2024-01-16 06:00:00', '0000-00-00 00:00:00', 1),
(19, '374283116824004', 'mpawseyi@last.fm', '3944505750', 'Pawsey', 'Muire', '4 Mendota Avenue', '2010-02-16', NULL, 2, '2024-06-24 06:00:00', '0000-00-00 00:00:00', 1),
(20, '374283533793071', 'ikaasmannj@nature.com', '8434045726', 'Kaasmann', 'Irvin', '97440 Homewood Street', '2009-07-26', NULL, 3, '2024-04-24 06:00:00', '0000-00-00 00:00:00', 1),
(21, '374283645766544', 'kedmondsonk@webs.com', '7197218493', 'Edmondson', 'Kelcy', '736 Darwin Road', '2010-03-29', NULL, 2, '2024-05-02 06:00:00', '0000-00-00 00:00:00', 1),
(22, '374283321886905', 'dbuickl@a8.net', '9383882654', 'Buick', 'Dionis', '4220 Bay Crossing', '2008-03-27', NULL, 1, '2024-01-10 06:00:00', '0000-00-00 00:00:00', 1),
(23, '374283649809795', 'hhonnicottm@godaddy.com', '9948771617', 'Honnicott', 'Harrietta', '2563 Bashford Pass', '2010-07-24', NULL, 2, '2024-05-16 06:00:00', '2023-11-23 06:00:00', 1),
(24, '374288996074703', 'ascrigmourn@ebay.co.uk', '8234533455', 'Scrigmour', 'Avictor', '2 Knutson Alley', '2009-07-09', NULL, 2, '2024-09-25 06:00:00', '0000-00-00 00:00:00', 1),
(25, '374288793977868', 'gmaplesdeno@ca.gov', '1128155523', 'Maplesden', 'Gale', '37500 Crest Line Drive', '2009-08-24', NULL, 2, '2024-02-29 06:00:00', '0000-00-00 00:00:00', 1),
(26, '374283888783487', 'tchiecop@nationalgeographic.com', '4389070402', 'Chieco', 'Thornton', '96203 Judy Trail', '2008-12-05', NULL, 2, '2024-03-15 06:00:00', '2024-07-13 06:00:00', 1),
(27, '374288949925936', 'ltinkhamq@edublogs.org', '3369908157', 'Tinkham', 'Lani', '75293 7th Point', '2010-11-22', NULL, 1, '2024-06-26 06:00:00', '0000-00-00 00:00:00', 1),
(28, '374288659232184', 'kcrosdillr@hhs.gov', '9192852180', 'Crosdill', 'Kristofor', '95 Milwaukee Drive', '2008-05-14', NULL, 3, '2024-06-19 06:00:00', '0000-00-00 00:00:00', 1),
(29, '374283511200339', 'aburgnes@oakley.com', '7908059183', 'Burgne', 'Anastasie', '82 Jay Lane', '2009-06-11', NULL, 3, '2024-02-19 06:00:00', '0000-00-00 00:00:00', 1),
(30, '374283240578120', 'alydstert@yandex.ru', '5445204770', 'Lydster', 'Ali', '38755 Coleman Circle', '2008-10-04', NULL, 2, '2024-09-11 06:00:00', '2023-10-28 06:00:00', 1),
(31, '374288057110255', 'pchesteru@comcast.net', '8496080891', 'Chester', 'Perry', '56439 Morningstar Street', '2009-09-08', NULL, 2, '2024-03-04 06:00:00', '0000-00-00 00:00:00', 1),
(32, '374288519877400', 'drugerv@elpais.com', '9651391609', 'Ruger', 'Darrelle', '86 Duke Point', '2009-02-18', NULL, 2, '2024-05-30 06:00:00', '0000-00-00 00:00:00', 1),
(33, '374283819704529', 'agallamorew@networkadvertising.org', '2666285927', 'Gallamore', 'Almire', '091 Harper Pass', '2010-03-31', NULL, 1, '2024-03-21 06:00:00', '2024-01-13 06:00:00', 1),
(34, '374283015723588', 'aweepersx@123-reg.co.uk', '4949162785', 'Weepers', 'Arvie', '8696 Bobwhite Lane', '2008-04-07', NULL, 1, '2024-09-10 06:00:00', '2024-10-30 16:22:16', 1),
(35, '374288044354032', 'ejosty@cafepress.com', '9743434354', 'Jost', 'Elbertina', '6 Twin Pines Center', '2008-10-30', NULL, 2, '2024-03-05 06:00:00', '2024-03-04 06:00:00', 1),
(36, '374283861612323', 'kfransinelliz@msn.com', '1019683994', 'Fransinelli', 'Kariotta', '4993 Namekagon Street', '2009-05-21', NULL, 2, '2024-07-07 06:00:00', '2023-12-31 06:00:00', 1),
(37, '374283910354356', 'mbills10@goo.ne.jp', '5954130373', 'Bills', 'Minny', '7883 Fisk Junction', '2008-04-20', NULL, 2, '2024-09-02 06:00:00', '0000-00-00 00:00:00', 1),
(38, '374283167958958', 'srowena11@flickr.com', '4221954441', 'Rowena', 'Suzie', '785 Dakota Avenue', '2009-10-31', NULL, 1, '2024-01-10 06:00:00', '0000-00-00 00:00:00', 1),
(39, '374288637415679', 'meivers12@nsw.gov.au', '5818353582', 'Eivers', 'Melisent', '4 Lillian Parkway', '2009-03-02', NULL, 2, '2024-08-23 06:00:00', '0000-00-00 00:00:00', 1),
(40, '374283533710711', 'nthurley13@who.int', '3639228647', 'Thurley', 'Nat', '8981 Emmet Alley', '2008-01-15', NULL, 3, '2023-06-26 06:00:00', '2023-10-25 06:00:00', 1),
(41, '374283027018274', 'qshone14@tumblr.com', '4804725466', 'Shone', 'Quinn', '6581 Harbort Point', '2008-10-24', NULL, 1, '2023-09-08 06:00:00', '2024-10-24 22:34:55', 1),
(42, '374288502043663', 'dtevelov15@usgs.gov', '6437593196', 'Tevelov', 'Dahlia', '85049 Stephen Hill', '2008-03-29', NULL, 3, '2023-04-28 06:00:00', '2024-07-29 06:00:00', 1),
(43, '374288923071038', 'tabrahamson16@yale.edu', '2324955331', 'Abrahamson', 'Terri', '84 Cody Avenue', '2009-12-30', NULL, 1, '2023-06-25 06:00:00', '0000-00-00 00:00:00', 1),
(44, '374283743291213', 'bwychard17@noaa.gov', '3269123038', 'Wychard', 'Benedikta', '96 Talmadge Avenue', '2009-05-14', NULL, 1, '2023-08-06 06:00:00', '0000-00-00 00:00:00', 1),
(45, '374283738256429', 'hstonebridge18@furl.net', '6023407188', 'Stonebridge', 'Haleigh', '2 Delladonna Center', '2010-10-03', NULL, 3, '2023-03-04 06:00:00', '2023-12-20 06:00:00', 1),
(46, '374288872900138', 'fsheere19@yellowbook.com', '3791851019', 'Sheere', 'Felicdad', '05967 Waywood Lane', '2009-04-10', NULL, 3, '2023-05-26 06:00:00', '0000-00-00 00:00:00', 1),
(47, '374283248814675', 'mallcott1a@va.gov', '2486581153', 'Allcott', 'Merrilee', '1 Ohio Court', '2009-09-13', NULL, 2, '2023-06-22 06:00:00', '0000-00-00 00:00:00', 1),
(48, '374288282925659', 'mjelf1b@bloglovin.com', '8364561680', 'Jelf', 'Marjy', '79 Anzinger Road', '2010-11-28', NULL, 3, '2023-02-13 06:00:00', '2023-10-31 06:00:00', 1),
(49, '374283653796821', 'lscaice1c@vkontakte.ru', '7653215994', 'Scaice', 'Leshia', '17 Amoth Road', '2008-09-28', NULL, 1, '2023-03-09 06:00:00', '0000-00-00 00:00:00', 1),
(50, '374283714537743', 'rmalcher1d@ustream.tv', '9342109227', 'Malcher', 'Robbert', '45 Anniversary Trail', '2009-03-15', NULL, 1, '2023-04-24 06:00:00', '0000-00-00 00:00:00', 1),
(51, '374283275511418', 'omaltman1e@icio.us', '8936308558', 'Maltman', 'Omar', '8778 Russell Avenue', '2009-06-03', NULL, 3, '2023-04-18 06:00:00', '0000-00-00 00:00:00', 1),
(52, '374283855732301', 'lkeneford1f@t-online.de', '9307384984', 'Keneford', 'Lula', '6 Buell Avenue', '2010-07-16', NULL, 3, '2023-01-22 06:00:00', '2024-07-30 06:00:00', 1),
(53, '374283317440022', 'xmcsperrin1g@cargocollective.com', '5751148983', 'McSperrin', 'Xaviera', '48 Maryland Avenue', '2010-05-04', NULL, 2, '2023-02-02 06:00:00', '0000-00-00 00:00:00', 1),
(54, '374283400501821', 'tcool1h@bloomberg.com', '3281096510', 'Cool', 'Trevar', '1686 Transport Center', '2009-12-26', NULL, 3, '2023-04-05 06:00:00', '0000-00-00 00:00:00', 1),
(55, '374283483391827', 'eglading1i@mayoclinic.com', '2388265834', 'Glading', 'Elana', '5 Jenna Terrace', '2010-10-11', NULL, 2, '2023-01-11 06:00:00', '0000-00-00 00:00:00', 1),
(56, '374283550725808', 'cmabone1j@hubpages.com', '2512921743', 'Mabone', 'Chelsie', '5 Bunting Center', '2010-07-31', NULL, 1, '2023-08-08 06:00:00', '0000-00-00 00:00:00', 1),
(57, '374288531205754', 'ebrandin1k@tinyurl.com', '2231623805', 'Brandin', 'Erna', '352 Chive Road', '2010-06-18', NULL, 2, '2023-02-16 06:00:00', '0000-00-00 00:00:00', 1),
(58, '374288616618087', 'mmcfade1l@sphinn.com', '2374847881', 'McFade', 'Maris', '0570 Roxbury Way', '2010-02-01', NULL, 3, '2023-09-27 06:00:00', '0000-00-00 00:00:00', 1),
(59, '374283606725653', 'cdetoc1m@wordpress.org', '4219304203', 'Detoc', 'Cindee', '152 Sutteridge Street', '2009-09-25', NULL, 2, '2023-08-21 06:00:00', '0000-00-00 00:00:00', 1),
(60, '374288275186772', 'fhargey1n@people.com.cn', '8514622198', 'Hargey', 'Freda', '9985 Drewry Alley', '2008-09-20', NULL, 2, '2023-04-06 06:00:00', '0000-00-00 00:00:00', 1),
(61, '374288407198182', 'wseivwright1o@ucoz.ru', '1902611106', 'Seivwright', 'Wye', '4 Dahle Court', '2009-09-13', NULL, 3, '2023-06-07 06:00:00', '0000-00-00 00:00:00', 1),
(62, '374283525166542', 'ddoumic1p@sbwire.com', '9217463134', 'Doumic', 'Doug', '661 Hoard Place', '2008-05-14', NULL, 2, '2023-03-03 06:00:00', '0000-00-00 00:00:00', 1),
(63, '374288515227444', 'elilian1q@seesaa.net', '2726417790', 'Lilian', 'Ernesta', '31441 Orin Circle', '2010-07-17', NULL, 1, '2023-03-11 06:00:00', '0000-00-00 00:00:00', 1),
(64, '374288685493024', 'mgilkison1r@eepurl.com', '8731923760', 'Gilkison', 'Mirella', '08409 Moulton Point', '2010-10-15', NULL, 3, '2023-06-29 06:00:00', '0000-00-00 00:00:00', 1),
(65, '374283660361874', 'hsickert1s@marketwatch.com', '7711970253', 'Sickert', 'Hamid', '7588 Dottie Pass', '2009-01-19', NULL, 1, '2023-02-02 06:00:00', '0000-00-00 00:00:00', 1),
(66, '374288844800002', 'cgremane1t@google.ca', '8679374497', 'Gremane', 'Cyril', '2467 Spenser Circle', '2009-04-09', NULL, 2, '2023-08-01 06:00:00', '0000-00-00 00:00:00', 1),
(67, '374288711790005', 'gscohier1u@slashdot.org', '4948135847', 'Scohier', 'Gaelan', '94 Mallard Junction', '2010-07-17', NULL, 2, '2023-07-01 06:00:00', '0000-00-00 00:00:00', 1),
(68, '374283144533163', 'sbircher1v@adobe.com', '7381239786', 'Bircher', 'Shurlocke', '068 Quincy Plaza', '2008-11-05', NULL, 3, '2023-01-02 06:00:00', '2024-01-24 06:00:00', 1),
(69, '374283185588936', 'ncornewell1w@uol.com.br', '6471779763', 'Cornewell', 'Noam', '097 Bayside Park', '2008-01-07', NULL, 3, '2023-01-06 06:00:00', '0000-00-00 00:00:00', 1),
(70, '374283438037533', 'ptruswell1x@rakuten.co.jp', '5392550584', 'Truswell', 'Polly', '53710 Acker Lane', '2008-04-05', NULL, 2, '2023-07-27 06:00:00', '0000-00-00 00:00:00', 1),
(71, '374288460236192', 'csaiz1y@amazon.co.uk', '1476182306', 'Saiz', 'Chris', '98592 Eagan Point', '2009-04-06', NULL, 3, '2023-09-01 06:00:00', '2024-01-03 06:00:00', 1),
(72, '374283860372580', 'msebley1z@i2i.jp', '8964841218', 'Sebley', 'Mariele', '3 Beilfuss Pass', '2008-01-15', NULL, 3, '2023-01-17 06:00:00', '0000-00-00 00:00:00', 1),
(73, '374283762059269', 'ohundley20@bravesites.com', '4907362863', 'Hundley', 'Odille', '8 Aberg Pass', '2009-09-04', NULL, 3, '2023-03-28 06:00:00', '0000-00-00 00:00:00', 1),
(74, '374283436056311', 'zperrigo21@ucoz.com', '4498897262', 'Perrigo', 'Zaneta', '841 Dorton Crossing', '2008-08-10', NULL, 3, '2023-03-02 06:00:00', '0000-00-00 00:00:00', 1),
(75, '374288508095212', 'jjanusik22@census.gov', '8063782654', 'Janusik', 'Jared', '496 Merrick Circle', '2008-08-03', NULL, 3, '2023-01-26 06:00:00', '2023-09-17 06:00:00', 1),
(76, '374283545687816', 'mledur23@dmoz.org', '2839853414', 'Ledur', 'Mar', '7762 Nelson Hill', '2009-10-06', NULL, 1, '2023-08-31 06:00:00', '0000-00-00 00:00:00', 1),
(77, '374283824267231', 'gcorry24@sun.com', '5568654849', 'Corry', 'Griffy', '6855 Village Green Parkway', '2009-06-19', NULL, 1, '2023-06-03 06:00:00', '2024-04-26 06:00:00', 1),
(78, '374283264833369', 'ahaller25@furl.net', '2117160906', 'Haller', 'Allen', '8609 7th Point', '2008-10-15', NULL, 3, '2023-09-23 06:00:00', '0000-00-00 00:00:00', 1),
(79, '374288248649740', 'mlabuschagne26@opera.com', '1374388557', 'Labuschagne', 'Micki', '0 Raven Center', '2009-09-26', NULL, 3, '2023-04-05 06:00:00', '0000-00-00 00:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargos`
--

DROP TABLE IF EXISTS `cargos`;
CREATE TABLE `cargos` (
  `idcargo` int(10) UNSIGNED NOT NULL,
  `nombre_cargo` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cargos`
--

INSERT INTO `cargos` (`idcargo`, `nombre_cargo`) VALUES
(4, 'director'),
(3, 'docente'),
(2, 'preceptor'),
(1, 'tecnico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

DROP TABLE IF EXISTS `cursos`;
CREATE TABLE `cursos` (
  `idcurso` int(10) UNSIGNED NOT NULL,
  `anio_curso` varchar(15) NOT NULL,
  `division_curso` varchar(15) NOT NULL,
  `estado_curso` int(1) NOT NULL,
  `fk_idturno_curso` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`idcurso`, `anio_curso`, `division_curso`, `estado_curso`, `fk_idturno_curso`) VALUES
(1, '1°', 'A', 1, 1),
(2, '1°', 'B', 1, 1),
(3, '1°', 'C', 1, 1),
(4, '1°', 'D', 1, 1),
(5, '1°', 'E', 1, 1),
(6, '2°', 'A', 1, 1),
(7, '2°', 'B', 1, 1),
(8, '2°', 'C', 1, 1),
(9, '2°', 'D', 1, 1),
(10, '3°', 'A', 1, 1),
(11, '3°', 'B', 1, 1),
(12, '3°', 'C', 1, 1),
(13, '4°', 'A', 1, 1),
(14, '4°', 'B', 1, 1),
(15, '5°', 'A', 1, 1),
(16, '5°', 'B', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docentes`
--

DROP TABLE IF EXISTS `docentes`;
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

--
-- Volcado de datos para la tabla `docentes`
--

INSERT INTO `docentes` (`iddocente`, `dni_docente`, `email_docente`, `celular_docente`, `apellido_docente`, `nombre_docente`, `fecha_nac_docente`, `fk_idcargo_docente`, `fk_idsituacion_docente`, `createdAt`, `updatedAt`, `estado_docente`) VALUES
(1, '9PJ2X94RX80', 'bwhetton0@squidoo.com', '9159882159', 'Whetton', 'Bob', '1974-08-24', 1, 1, '2023-10-19 06:00:00', '0000-00-00 00:00:00', 1),
(2, '9NN6ED9AX70', 'mohern1@quantcast.com', '9467296237', 'O\' Hern', 'Mitch', '1988-07-04', 1, 1, '2024-06-27 06:00:00', '0000-00-00 00:00:00', 1),
(3, '8XQ0AY4RH95', 'ldugdale0@yelp.com', '4757056571', 'Dugdale', 'Lettie', '1982-07-23', 2, 1, '2024-05-30 06:00:00', '0000-00-00 00:00:00', 1),
(4, '9N61FA5UG53', 'phaggata1@usatoday.com', '3898359875', 'Haggata', 'Parke', '1977-03-01', 2, 1, '2024-02-24 06:00:00', '0000-00-00 00:00:00', 1),
(5, '5GY9Q82TF07', 'ralebrooke2@seesaa.net', '6015002250', 'Alebrooke', 'Ron', '1996-08-02', 2, 1, '2024-07-25 06:00:00', '0000-00-00 00:00:00', 1),
(6, '1MG0FH9JD36', 'rjakes3@bizjournals.com', '2937121251', 'Jakes', 'Remy', '1997-08-05', 2, 1, '2024-02-17 06:00:00', '0000-00-00 00:00:00', 1),
(7, '8KP5MX9KA58', 'rrisen0@theatlantic.com', '3363598253', 'Risen', 'Rodolfo', '1996-04-04', 3, 1, '2024-07-07 06:00:00', '2024-03-03 06:00:00', 1),
(8, '5TH9YC9WC25', 'aalbarez1@ucoz.ru', '1132717615', 'Albarez', 'Abbi', '1987-05-26', 3, 3, '2024-05-22 06:00:00', '0000-00-00 00:00:00', 1),
(9, '2DD6H77QY50', 'cdonavan2@craigslist.org', '1301716142', 'Donavan', 'Cord', '1996-06-15', 3, 1, '2023-09-26 06:00:00', '2024-05-17 06:00:00', 1),
(10, '3UH2Q72GJ67', 'bsingh3@ucoz.ru', '1618154913', 'Singh', 'Boycey', '1973-05-24', 3, 3, '2024-02-08 06:00:00', '0000-00-00 00:00:00', 1),
(11, '7U51HQ2FM95', 'bredwing4@sphinn.com', '2883163281', 'Redwing', 'Brianna', '1979-02-26', 3, 2, '2024-04-11 06:00:00', '0000-00-00 00:00:00', 1),
(12, '7TR5QJ2YQ28', 'cbruin5@geocities.jp', '4138673532', 'Bruin', 'Cal', '1999-07-02', 3, 2, '2024-07-04 06:00:00', '0000-00-00 00:00:00', 1),
(13, '8V53YC7CT40', 'ocockney6@cargocollective.com', '8074814972', 'Cockney', 'Oriana', '1970-03-05', 3, 3, '2023-11-15 06:00:00', '0000-00-00 00:00:00', 1),
(14, '9J83UR9FK48', 'anewcomb7@exblog.jp', '6042934595', 'Newcomb', 'Ase', '1994-06-08', 3, 1, '2023-10-13 06:00:00', '0000-00-00 00:00:00', 1),
(15, '8ET8U78PV78', 'adodsley8@blinklist.com', '1641721078', 'Dodsley', 'Angeli', '1974-06-02', 3, 2, '2023-08-26 06:00:00', '0000-00-00 00:00:00', 1),
(16, '3Q76QG7YN25', 'mlenormand9@chron.com', '4526348053', 'Lenormand', 'Marv', '1978-08-11', 3, 1, '2024-02-07 06:00:00', '0000-00-00 00:00:00', 1),
(17, '6HK3CT0GA48', 'ncristoferia@cargocollective.com', '7465015676', 'Cristoferi', 'Nicola', '1986-08-04', 3, 1, '2024-07-15 06:00:00', '0000-00-00 00:00:00', 1),
(18, '9GC3C75CH12', 'hnisbithb@hhs.gov', '3277610479', 'Nisbith', 'Hakeem', '1986-07-15', 3, 2, '2023-12-28 06:00:00', '0000-00-00 00:00:00', 1),
(19, '3PK0QJ9QH53', 'nslocketc@answers.com', '9735546753', 'Slocket', 'Nanete', '1985-05-14', 3, 2, '2023-08-31 06:00:00', '0000-00-00 00:00:00', 1),
(20, '4FQ2Q19YH45', 'hcovolinid@reverbnation.com', '4712180367', 'Covolini', 'Hailey', '1995-04-21', 3, 3, '2023-09-23 06:00:00', '0000-00-00 00:00:00', 1),
(21, '1AJ7G47DG97', 'kastleye@google.com.hk', '2879159027', 'Astley', 'Kerry', '1987-01-21', 3, 3, '2023-12-20 06:00:00', '0000-00-00 00:00:00', 1),
(22, '9JT2NK5AJ35', 'dpetrinaf@fastcompany.com', '2122983588', 'Petrina', 'Demott', '1997-03-25', 3, 3, '2024-08-01 06:00:00', '2023-10-09 06:00:00', 1),
(23, '3DX3TP4TW83', 'ppetrushkag@homestead.com', '9449956928', 'Petrushka', 'Paxon', '1981-02-04', 3, 1, '2024-06-27 06:00:00', '0000-00-00 00:00:00', 1),
(24, '5EE6CC8TC49', 'hcallejah@sourceforge.net', '7458003431', 'Calleja', 'Helge', '1988-08-28', 3, 1, '2023-10-28 06:00:00', '0000-00-00 00:00:00', 1),
(25, '6KV5H79GK37', 'rfullwoodi@dedecms.com', '8818211645', 'Fullwood', 'Reg', '1984-05-06', 3, 1, '2024-04-08 06:00:00', '0000-00-00 00:00:00', 1),
(26, '1HD2WE6PV49', 'mconkayj@virginia.edu', '9361041269', 'Conkay', 'Matthias', '1980-11-27', 3, 1, '2024-01-13 06:00:00', '2024-03-27 06:00:00', 1),
(27, '4DD7RA4YY27', 'aewingsk@shop-pro.jp', '8804402014', 'Ewings', 'Alberik', '1975-05-18', 3, 1, '2024-04-02 06:00:00', '0000-00-00 00:00:00', 1),
(28, '2D68JU5PH18', 'sthorsbyl@icq.com', '1919901271', 'Thorsby', 'Sigismond', '1971-10-19', 3, 1, '2024-04-23 06:00:00', '2023-12-21 06:00:00', 1),
(29, '4JH7TF9EN22', 'dgiacobellim@admin.ch', '2752146899', 'Giacobelli', 'Dannie', '1976-10-02', 3, 1, '2023-11-01 06:00:00', '0000-00-00 00:00:00', 1),
(30, '3XD1TG7UJ09', 'jhanshawn@dmoz.org', '6481805112', 'Hanshaw', 'Jennee', '1995-04-19', 3, 3, '2024-01-08 06:00:00', '0000-00-00 00:00:00', 1),
(31, '8UP9F44TU74', 'preuthero@cafepress.com', '4705403271', 'Reuther', 'Peri', '1974-07-19', 3, 1, '2023-11-08 06:00:00', '0000-00-00 00:00:00', 1),
(32, '2FT0JE1FR40', 'zgoomp@shutterfly.com', '9875314556', 'Goom', 'Zack', '1996-01-29', 3, 3, '2023-09-26 06:00:00', '2024-04-10 06:00:00', 1),
(33, '9RD4AX9FQ35', 'ltebbuttq@fda.gov', '6078738009', 'Tebbutt', 'Leonard', '1998-02-03', 3, 2, '2024-04-23 06:00:00', '2023-12-18 06:00:00', 1),
(34, '1XC6P35JP26', 'ctroakr@columbia.edu', '4903608347', 'Troak', 'Carlynn', '1999-10-15', 3, 1, '2023-09-18 06:00:00', '0000-00-00 00:00:00', 1),
(35, '8HK8UM8YF51', 'nteases@comcast.net', '4682117403', 'Tease', 'Nariko', '1981-04-07', 3, 1, '2024-04-28 06:00:00', '2023-09-07 06:00:00', 1),
(36, '9J44D77GX51', 'gstarzakert@huffingtonpost.com', '1105102921', 'Starzaker', 'Geraldine', '1978-01-02', 3, 3, '2024-03-02 06:00:00', '0000-00-00 00:00:00', 1),
(37, '6EM5F55UN88', 'mgingeru@reference.com', '8276544165', 'Ginger', 'Morey', '1991-01-10', 3, 1, '2024-06-21 06:00:00', '2023-10-06 06:00:00', 1),
(38, '1HT1FQ0MY87', 'aanthonyv@discovery.com', '5714985791', 'Anthony', 'Ansel', '1993-11-11', 3, 3, '2023-09-22 06:00:00', '2023-11-15 06:00:00', 1),
(39, '7W31NM9PV00', 'ykrishtopaittisw@blog.com', '6493298176', 'Krishtopaittis', 'York', '1991-12-31', 3, 3, '2023-12-23 06:00:00', '0000-00-00 00:00:00', 1),
(40, '4U39RY2EC99', 'kgidleyx@pbs.org', '1716097431', 'Gidley', 'Kimmie', '1988-07-04', 3, 2, '2023-08-27 06:00:00', '2024-05-27 06:00:00', 1),
(41, '5MD4CP5KY98', 'ayurocjhiny@gizmodo.com', '9971270333', 'Yurocjhin', 'Alexandra', '1994-03-09', 3, 3, '2023-10-06 06:00:00', '0000-00-00 00:00:00', 1),
(42, '1KT3GT4YH34', 'rtrevearz@vk.com', '5089554067', 'Trevear', 'Rafe', '1995-06-14', 3, 3, '2023-08-20 06:00:00', '0000-00-00 00:00:00', 1),
(43, '8CW4R95UF53', 'ajolley10@nytimes.com', '2384346676', 'Jolley', 'Adriana', '1999-07-01', 3, 1, '2023-12-16 06:00:00', '0000-00-00 00:00:00', 1),
(44, '3CW9Q18HD95', 'mantognoni11@wunderground.com', '3982649205', 'Antognoni', 'Megan', '1989-01-04', 3, 2, '2024-02-06 06:00:00', '0000-00-00 00:00:00', 1),
(45, '4GK8XV2XN36', 'eservant12@earthlink.net', '9066678457', 'Servant', 'Elinor', '1993-01-10', 3, 3, '2024-07-03 06:00:00', '0000-00-00 00:00:00', 1),
(46, '6U78FP7TD82', 'mhawkeswood13@networksolutions.com', '7601475471', 'Hawkeswood', 'Meyer', '1995-07-13', 3, 1, '2023-09-26 06:00:00', '2024-01-13 06:00:00', 1),
(47, '4H48D65WW63', 'pbrede0@irs.gov', '9254733237', 'Brede', 'Peta', '1997-10-17', 4, 1, '2023-09-16 06:00:00', '2024-06-07 06:00:00', 1),
(48, '6KJ5QV4WU79', 'aiacovone1@go.com', '3545718146', 'Iacovone', 'Arch', '1983-02-11', 4, 1, '2024-01-07 06:00:00', '0000-00-00 00:00:00', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

DROP TABLE IF EXISTS `generos`;
CREATE TABLE `generos` (
  `idgenero` int(10) UNSIGNED NOT NULL,
  `nombre_genero` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `generos`
--

INSERT INTO `generos` (`idgenero`, `nombre_genero`) VALUES
(2, 'femenino'),
(1, 'masculino'),
(3, 'otro');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias`
--

DROP TABLE IF EXISTS `materias`;
CREATE TABLE `materias` (
  `idmateria` int(10) UNSIGNED NOT NULL,
  `nombre_materia` varchar(100) NOT NULL,
  `estado_materia` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materias`
--

INSERT INTO `materias` (`idmateria`, `nombre_materia`, `estado_materia`) VALUES
(1, 'Biología I', 1),
(2, 'Educación Artística I', 1),
(3, 'Educación Física I', 1),
(4, 'Formación Ética y Ciudadana I', 1),
(5, 'Educación Tecnológica I', 1),
(6, 'Geografía I', 1),
(7, 'HDI Formación Para La Vida', 1),
(8, 'HDI Educar En Valores', 1),
(9, 'Historia I', 1),
(10, 'Lengua Extranjera I', 1),
(11, 'Lengua y Literatura I', 1),
(12, 'Matemática I', 1),
(13, 'Química I', 1),
(14, 'Educación Artística II', 1),
(15, 'Educación Física II', 1),
(16, 'Educación Tecnológica II', 1),
(17, 'Formación Ética y Ciudadana II', 1),
(18, 'Geografía II', 1),
(19, 'Historia II', 1),
(20, 'Lengua Extranjera II', 1),
(21, 'Lengua y Literatura II', 1),
(22, 'Matemática II', 1),
(23, 'Física I', 1),
(24, 'Biología II', 1),
(25, 'Educación Artística III', 1),
(26, 'Educación Física III', 1),
(27, 'Formación Ética y Ciudadana III', 1),
(28, 'Química II', 1),
(29, 'Física II', 1),
(30, 'Comunicación, Cultura y Sociedad', 1),
(31, 'Psicología', 1),
(32, 'Lengua Extranjera III', 1),
(33, 'Lengua y Literatura III', 1),
(34, 'Matemática III', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `materias_cursos`
--

DROP TABLE IF EXISTS `materias_cursos`;
CREATE TABLE `materias_cursos` (
  `idmateriacurso` int(10) UNSIGNED NOT NULL,
  `fk_iddocente_materiacurso` int(10) UNSIGNED DEFAULT NULL,
  `fk_idcurso_materiacurso` int(10) UNSIGNED DEFAULT NULL,
  `fk_idmateria_materiacurso` int(10) UNSIGNED DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `estado_materiacurso` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `materias_cursos`
--

INSERT INTO `materias_cursos` (`idmateriacurso`, `fk_iddocente_materiacurso`, `fk_idcurso_materiacurso`, `fk_idmateria_materiacurso`, `createdAt`, `updatedAt`, `estado_materiacurso`) VALUES
(1, 1, 1, 1, '2024-09-30 02:01:54', '2024-09-30 02:02:18', 1),
(2, 1, 5, 1, '2024-09-30 02:01:54', '2024-09-30 05:11:56', 1),
(3, 1, 9, 1, '2024-09-30 02:01:54', '2024-09-30 05:11:56', 1),
(4, 1, 13, 1, '2024-09-30 02:01:54', '2024-09-30 05:11:56', 1),
(5, 1, 1, 2, '2024-10-01 22:40:47', '2024-10-03 21:52:03', 1),
(6, 3, 5, 2, '2024-10-01 22:40:47', '2024-10-07 21:35:59', 1),
(7, 1, 9, 2, '2024-10-01 22:40:47', '2024-10-08 22:18:27', 1),
(8, 1, 13, 2, '2024-10-01 22:40:47', '2024-10-29 16:41:59', 1),
(9, 1, 1, 3, '2024-10-01 22:40:52', '2024-10-07 21:30:55', 1),
(10, 3, 5, 3, '2024-10-01 22:40:52', '2024-10-07 21:35:59', 1),
(11, NULL, 9, 3, '2024-10-01 22:40:52', '2024-10-01 22:40:52', 1),
(12, NULL, 13, 3, '2024-10-01 22:40:52', '2024-10-01 22:40:52', 1),
(13, 1, 1, 4, '2024-10-01 22:40:52', '2024-10-07 21:30:55', 1),
(14, NULL, 5, 4, '2024-10-01 22:40:52', '2024-10-01 22:40:52', 1),
(15, NULL, 9, 4, '2024-10-01 22:40:52', '2024-10-01 22:40:52', 1),
(16, NULL, 13, 4, '2024-10-01 22:40:52', '2024-10-01 22:40:52', 1),
(17, 1, 2, 1, '2024-10-01 22:41:17', '2024-10-08 02:49:40', 1),
(18, NULL, 3, 1, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(19, 1, 6, 1, '2024-10-01 22:41:17', '2024-10-08 02:50:06', 1),
(20, NULL, 7, 1, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(21, NULL, 10, 1, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(22, 1, 11, 1, '2024-10-01 22:41:17', '2024-10-29 21:29:35', 1),
(23, NULL, 14, 1, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(24, NULL, 15, 1, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(25, NULL, 2, 2, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(26, NULL, 3, 2, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(27, NULL, 6, 2, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(28, NULL, 7, 2, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(29, NULL, 10, 2, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(30, NULL, 11, 2, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(31, NULL, 14, 2, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(32, NULL, 15, 2, '2024-10-01 22:41:17', '2024-10-01 22:41:17', 1),
(33, NULL, 4, 1, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(34, 1, 8, 1, '2024-10-08 14:27:56', '2024-10-30 16:24:50', 1),
(35, NULL, 12, 1, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(36, NULL, 16, 1, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(37, NULL, 4, 2, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(38, NULL, 8, 2, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(39, NULL, 12, 2, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(40, NULL, 16, 2, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(41, NULL, 4, 3, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(42, NULL, 8, 3, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(43, NULL, 12, 3, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(44, NULL, 16, 3, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(45, NULL, 4, 4, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(46, NULL, 8, 4, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(47, NULL, 12, 4, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(48, NULL, 16, 4, '2024-10-08 14:27:56', '2024-10-08 14:27:56', 1),
(49, NULL, 3, 3, '2024-10-08 22:17:35', '2024-10-08 22:17:35', 1),
(50, NULL, 7, 3, '2024-10-08 22:17:35', '2024-10-08 22:17:35', 1),
(51, NULL, 11, 3, '2024-10-08 22:17:35', '2024-10-08 22:17:35', 1),
(52, NULL, 15, 3, '2024-10-08 22:17:35', '2024-10-08 22:17:35', 1),
(53, NULL, 3, 4, '2024-10-08 22:17:35', '2024-10-08 22:17:35', 1),
(54, NULL, 7, 4, '2024-10-08 22:17:35', '2024-10-08 22:17:35', 1),
(55, NULL, 11, 4, '2024-10-08 22:17:35', '2024-10-08 22:17:35', 1),
(56, NULL, 15, 4, '2024-10-08 22:17:35', '2024-10-08 22:17:35', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notas`
--

DROP TABLE IF EXISTS `notas`;
CREATE TABLE `notas` (
  `idnota` int(10) UNSIGNED NOT NULL,
  `fk_idalumno_nota` int(10) UNSIGNED NOT NULL,
  `fk_idmateriacurso_nota` int(10) UNSIGNED NOT NULL,
  `nota1_nota` decimal(5,2) DEFAULT NULL,
  `nota2_nota` decimal(5,2) DEFAULT NULL,
  `nota3_nota` decimal(5,2) DEFAULT NULL,
  `notadic_nota` decimal(5,2) DEFAULT NULL,
  `notafeb_nota` decimal(5,2) DEFAULT NULL,
  `notadef_nota` decimal(5,2) DEFAULT NULL,
  `obs_nota` varchar(255) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `ciclo_lectivo_nota` varchar(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `idrol` int(10) UNSIGNED NOT NULL,
  `nombre_rol` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`idrol`, `nombre_rol`) VALUES
(1, 'administrador'),
(4, 'director'),
(3, 'docente'),
(2, 'preceptor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `situaciones`
--

DROP TABLE IF EXISTS `situaciones`;
CREATE TABLE `situaciones` (
  `idsituacion` int(10) UNSIGNED NOT NULL,
  `nombre_situacion` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `situaciones`
--

INSERT INTO `situaciones` (`idsituacion`, `nombre_situacion`) VALUES
(3, 'interino'),
(2, 'suplente'),
(1, 'titular');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

DROP TABLE IF EXISTS `turnos`;
CREATE TABLE `turnos` (
  `idturno` int(10) UNSIGNED NOT NULL,
  `nombre_turno` varchar(15) NOT NULL,
  `estado_turno` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`idturno`, `nombre_turno`, `estado_turno`) VALUES
(1, 'mañana', 1),
(2, 'tarde', 1),
(3, 'noche', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tutores`
--

DROP TABLE IF EXISTS `tutores`;
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

--
-- Volcado de datos para la tabla `tutores`
--

INSERT INTO `tutores` (`idtutor`, `dni_tutor`, `email_tutor`, `celular_tutor`, `apellido_tutor`, `nombre_tutor`, `direccion_tutor`, `createdAt`, `updatedAt`, `estado_tutor`) VALUES
(1, '87664576', 'algfodeprueba@gmail.com', '8766543647', 'pruebatutor', 'nombrepureba', 'alla es la direccion', '2024-10-30 16:50:39', '2024-10-30 16:50:39', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
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
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`idusuario`, `password_usuario`, `nombre_usuario`, `fk_iddocente_usuario`, `fk_idrol_usuario`, `createdAt`, `updatedAt`, `estado_usuario`) VALUES
(1, '$2a$10$FkZ6QSz/ul9lHbCHnkXe.OTMzWCh8FRfXtS/Wl4PVHngwfBFsXp0O', 'Alessandra', 1, 1, '2024-07-26 06:00:00', '0000-00-00 00:00:00', 1),
(2, '$2a$10$FkZ6QSz/ul9lHbCHnkXe.OTMzWCh8FRfXtS/Wl4PVHngwfBFsXp0O', 'Vicky', 2, 2, '2023-03-30 06:00:00', '0000-00-00 00:00:00', 1),
(3, '$2a$10$FkZ6QSz/ul9lHbCHnkXe.OTMzWCh8FRfXtS/Wl4PVHngwfBFsXp0O', 'Lara', 3, 3, '2023-04-19 06:00:00', '0000-00-00 00:00:00', 1),
(4, '$2a$10$FkZ6QSz/ul9lHbCHnkXe.OTMzWCh8FRfXtS/Wl4PVHngwfBFsXp0O', 'Tobias', 4, 4, '2024-03-08 06:00:00', '0000-00-00 00:00:00', 1);

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
  MODIFY `idalumno` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=488;

--
-- AUTO_INCREMENT de la tabla `cargos`
--
ALTER TABLE `cargos`
  MODIFY `idcargo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `idcurso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `docentes`
--
ALTER TABLE `docentes`
  MODIFY `iddocente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `idgenero` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `materias`
--
ALTER TABLE `materias`
  MODIFY `idmateria` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `materias_cursos`
--
ALTER TABLE `materias_cursos`
  MODIFY `idmateriacurso` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT de la tabla `notas`
--
ALTER TABLE `notas`
  MODIFY `idnota` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `idrol` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `situaciones`
--
ALTER TABLE `situaciones`
  MODIFY `idsituacion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `idturno` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tutores`
--
ALTER TABLE `tutores`
  MODIFY `idtutor` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idusuario` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
