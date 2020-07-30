module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if(req.isAuthenticated()){
            return next()
        }
        res.redirect('/user/login')
    },
    forwardAuthenticated: (req, res, next) => {
        if(!req.isAuthenticated()){
            return next()
        }
        res.redirect(`/user/${req.user.slug}/dashboard`)
    }
}