/*EXPRESS/PATH/EJS*/
const express = require("express");
const app = express();
const path = require("path");

/* SESSION de USUARIO */
const session = require("express-session");
app.use(
    session({
        secret: "Mi_secreto", // Clave fuerte y consistente en toda la aplicación
        resave: false, // No guarda la sesión en cada solicitud si no hay cambios
        saveUninitialized: false, // No guarda sesiones vacías
        cookie: {
            secure: process.env.NODE_ENV === "production", // Cambia a true en producción con HTTPS
            httpOnly: true, // Solo accesible desde el servidor
            maxAge: 60 * 60 * 1000 // 1 hora
        }
    })
);

/* COOKIES */
const cookies = require("cookie-parser");
app.use(cookies()); // Cookie parser para manejar cookies del cliente

// Middleware temporal para inspeccionar cookies y depurar errores
app.use((req, res, next) => {
    console.log("Cookies recibidas:", req.cookies);
    console.log("Cookies firmadas:", req.signedCookies);
    next();
});

// Middleware para limpiar cookies inválidas (opcional, según tu necesidad)
app.use((req, res, next) => {
    if (req.cookies.miCookieInvalida) {
        console.log("Eliminando cookie inválida...");
        res.clearCookie("miCookieInvalida");
    }
    next();
});

/* VERIFICACIÓN DE CONEXIÓN SEQUELIZE */
const checkConnection = require(path.resolve(__dirname, "./database/config/checkConnection"));
checkConnection();

/* LLAMADO AL EJS */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* STATICS */
const carpetaPublic = path.resolve(__dirname, "../public");
app.use(express.static(path.join(carpetaPublic)));

/* CAPTURADOR DE INFORMACIÓN */
/* Capturamos datos de un formulario en forma de objeto */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* MEJORA A LOS VERBOS HTTP: PUT - DELETE */
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

/* MIDDLEWARES */
const userLoggedMiddleware = require(path.resolve(__dirname, "./middlewares/userLoggedMiddleware"));
app.use(userLoggedMiddleware);

const notLoggedMiddleware = require(path.resolve(__dirname, "./middlewares/notLoggedMiddleware"));
const rolAdminMiddleware = require(path.resolve(__dirname, "./middlewares/rolAdminMiddleware"));

/* ROUTES */
const rutasAdmin = require(path.resolve(__dirname, "./routes/admin.routes"));
const rutasPreceptor = require(path.resolve(__dirname, "./routes/preceptor.routes"));
const rutasDocente = require(path.resolve(__dirname, "./routes/docente.routes"));
const rutasDirectivo = require(path.resolve(__dirname, "./routes/directivo.routes"));
const rutasIndex = require(path.resolve(__dirname, "./routes/main.routes"));

/* ENTRY POINTS */
app.use("/administrador", rolAdminMiddleware, notLoggedMiddleware, rutasAdmin);
app.use("/preceptor", notLoggedMiddleware, rutasPreceptor);
app.use("/docente", notLoggedMiddleware, rutasDocente);
app.use("/directivo", notLoggedMiddleware, rutasDirectivo);
app.use("/", rutasIndex);

/* APIs */
/* ROUTES */
// const rutasApiIndex = require(path.resolve(__dirname, "./routes/apis/apiIndex.routes"));

/* ENTRY POINTS */
// app.use("/api/index", rutasApiIndex);

/* RESPUESTA AL ERROR 404 */
app.use((req, res, next) => {
    res.status(404).render("404");
});

/* PUERTO */
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`
    Nuestra app funciona en
    http://localhost:${port}`);
});
