const Proyecto = require("../models/Proyectos");
const Usuario = require("../models/Usuarios");
const bcrypt = require('bcrypt')
const passport = require('passport')
const crypto = require('crypto')
const { Op } = require('sequelize');
const { enviar } = require("../handlers/mail");

exports.crearUsuario = (req, res) => {

    res.render('crearUsuario.pug', {
        nombre: "Crear Usuario",
    })
}

// crea un nuevo usuario

exports.nuevoUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        await Usuario.create({
            email,
            password
        })
        // crear url de confirmar
        const confirmUrl = `http://${req.headers.host}/confirmar/${email}`
        
        // obtener email del nuevo usuario o crear un objeto usuario con una propiedad email
        const usuario = {
            email
        }
        
        // enviar email
        await enviar({
            usuario,
            subject: 'Confirmar Cuenta',
            confirmUrl,
            archivo: 'confirmAccount'
        })

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta')
        res.redirect('/iniciarSesion')
    } catch (error) {
        console.log(error)
        req.flash('error', error.errors.map(error => error.message)) // agrega los mensaje de error al midleware req.flash.mensajes
            
        }
        res.render('crearUsuario.pug', {
                nombre: "Crear Uusuario",
                errores:req.flash(),
                email,
                password
                })
    }
    // =========================
    // === custom valiations ===
    // =========================
    // let errors = []
    // const usuario = Usuario.findOne({
    //     where: {
    //         email
    //     }
    // })
    // if(usuario) {
    //     console.log("usuario existente")
    //     errors.push({"mensaje": "Usuario ya existe"})
    // }
    
    // if (!email.length) {
    //     errors.push({"mensaje": "debes indicar el email"})
    // }
    // if (!password.length) {
    //     errors.push({"mensaje": " debes ingreasar una contraseña"})
    // }
    // if (errors.length) {
    //     res.render('crearUsuario.pug', {
    //         nombre: "Crear Uusuario",
    //         errors
    //     })
    // } else {
    //     await Usuario.create({
    //         email,
    //         password
    //     }).then(() => {
    //         res.redirect('/iniciarSesion')
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // }


exports.confirmarCuenta = async (req, res) => {
    const { email } = req.params;
    const usuario = await Usuario.findOne({ where: {email} })
    if (!usuario) {
        req.flash('error', 'usuario no encontrado')
        res.redirect('/iniciarSesion')
    }
    await Usuario.update(
        { activo:1 },
        { where:{email} })
    req.flash('correcto', 'Cuenta creada exitosamente')
    res.redirect('/iniciarSesion')
}
exports.iniciarSesion = (req, res) => {
    
    const { error } = res.locals.errores
    res.render('login.pug', {
        nombre: "Login",
        error
    })
}
// inicio de sesion de usuario
exports.autenticarUsuario = passport.authenticate('local',
                            { 
                                successRedirect: '/',
                                failureRedirect: '/iniciarSesion',
                                failureFlash: true,
                                badRequestMessage: 'faltan las credenciales'
                            })
                            // (req, res) => {
                            //     res.redirect('/')
                            // })
// exports.autenticarUsuario = async (req, res) => {
//     const { email, password } = req.body;
//     const usuario = await Usuario.findOne(
//         {
//             where: {
//                 email
//             }
//         }
//     )
//     if (usuario) {
//         const match = await bcrypt.compare(password, usuario.password)
//         if (match) {
//             console.log("bienveniiiiido")
//             res.send('bienvenido')
//         }
//         else {
//             console.log('contraseña incorrecta')
//         }
//     } else {
//         res.render('login.pug', {
//             nombre: "Login"

//     }
//     )}
// }

// comprobar si el usuario está autenticado

exports.estaAutenticado = (req, res, next) => {
    console.log(res.locals.usuario)
    if (req.isAuthenticated()) {
        return next()
    } else {
        res.redirect('/iniciarSesion')
    }
}

exports.cerrarSesion = (req, res) =>{
    req.session.destroy(() => {
        res.redirect('/iniciarSesion')
    })
}

exports.reestablecer = (req, res) => {
    res.render('reset', {
        nombre: 'Reestablecer Contraseña'
    })
}
exports.enviarToken = async (req, res) => {
    const { email } = req.body
    const usuario = await Usuario.findOne({where: {email}})
    if (!usuario) {
        req.flash('error', 'No existe esa cuenta')
        res.redirect('/reestablecer')
    } else {
        // gnener token
        usuario.token = crypto.randomBytes(20).toString("hex");
        // generar expiracion
        usuario.expiracion = Date.now() + 3600000;

        await usuario.save();

        //url reset password
        res.json({true: " json enviado"})

        const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`

        await enviar({
            usuario,
            subject: 'Reset Password',
            resetUrl,
            archivo: 'resetPassword'
        })

    }
}

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const usuario = await Usuario.findOne({where: {
        token
    }})
    if (!usuario) {
        req.flash('error', 'No válido')
        res.redirect('/reestablecer')
    }
    res.render('resetPassword.pug', {
        nombre: 'Reestablecer contraseña'
    })
}

exports.nuevaContraseña = async (req, res) => {
    const usuario = await Usuario.findOne({
        where:{
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    })
    // console.log("token comprobado")
    // console.log(usuario)
    if (!usuario) {
        req.flash('error', 'Token expiró')
        res.redirect('/reestablecer')
    }
    const { password } = req.body
    const hashedpssword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))
    await Usuario.update(
        { password: hashedpssword,
            token: null,
            expiracion: null},
        { where: {
            token: req.params.token
        }}
    )
    req.flash('correcto', 'Contraseña reestablecida')
    res.redirect('/iniciarSesion')
}
