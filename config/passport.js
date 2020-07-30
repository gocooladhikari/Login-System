const LocalStrategy = require('passport-local').Strategy

const User = require('../model/User')
const e = require('express')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
            User.findOne({email: email}).then(user => {
                if(!user) {
                    done(null, false)
                    console.log("Not registered")
                }else{
                    if(password !== user.password){
                        done(null, false)
                    }else{
                        done(null, user)
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}