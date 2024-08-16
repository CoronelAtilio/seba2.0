function rolAdminMiddleware(req, res, next) {
    if (req.session && req.session.userLogged) {
        const rol = req.session.userLogged.rol;

        if (rol === "administrador") {
            return next();
        } else {
            return res.redirect('/welcome');
        }
    }
    
    // Si no hay sesión o no hay usuario logueado
    return res.redirect('/');
}

module.exports = rolAdminMiddleware;
