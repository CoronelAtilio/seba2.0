function yesLoggedMiddleware(req, res, next) {
    if (req.session && req.session.userLogged) {
        res.redirect('/welcome');
    }else{
        next()
    }
}

module.exports = yesLoggedMiddleware;