function notLoggedMiddleware(req, res, next) {
    if (req.session && req.session.userLogged) {
        next()
    }else{
        res.redirect('/');
    }
}

module.exports = notLoggedMiddleware;