const express = require('express')
const router = express.Router()
const Client = require('./../models/client.model.js')
const bcrypt = require("bcryptjs")
const bcryptSalt = 10
const passport = require('passport')

//SIGNUP

router.get('/signup', (req, res, next) => res.render("client/signup"))

router.post('/signup', (req, res, next) => {
    const { username, password } = req.body

     if (username === "" || password === "") {
        res.render("client/signup", { errorMsg: "Rellena todos los campos" })
        return
    }

    Client
        .findOne({ username })
        .then(client => {
            if (client) {
                res.render("client/signup", { errorMsg: "Este usuario ya existe" })
                return
            }

            
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

            Client.create({ username, password: hashPass })
                .then(() => res.redirect('/'))
                .catch(() => res.render("client/signup", { errorMsg: "Hubo un error" }))
        })
        .catch(error => next(error))
})

 //LOGIN   

router.get('/login', (req, res, next) => res.render("client/login"))


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
}))



router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})


module.exports = router