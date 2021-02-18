const passport = require('passport')
const LocalStrategy = require('passport-local')
const Usuario = require('../models/Usuarios')
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy(
    //por defecto passport espera username y password por lo que redefinimos estas variables
    {
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password,done) => {
        try {
            const usuario = await Usuario.findOne({
                where: {
                    email
                }
            })
            if (usuario) {
                const match = await bcrypt.compare(password, usuario.password)
                if (match && usuario.activo === 1) {
                    console.log("bienveniiiiidooooo")
                    return done(null, usuario)
                } else if (match && usuario.activo === 0){
                    console.log("confirma tu cuenta!!!")
                    return done(null, false, {
                        message: 'Confirma tu cuenta'
                    })
                }
                else {
                    console.log("contraseñaaaa incorreeeectaaa")
                    return done(null, false, {
                        message: 'Contraseña incorrecta'
                    })
                }
            }
            else {
                console.log("no existe el usuario")
                return done(null, false, {
                    message: 'Usuario no existe'
                })
            }
        } catch (error) {
            //no esxiste el usuario
            console.log('no existe el usuuuuuarioooo')
            console.log(error)
            return done(null, false, {
                message: 'No existe el usuario'
            })
        }
    }
))

//serializar un usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario)
})

//deserializar un usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario)
})


module.exports = passport;